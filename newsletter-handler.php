<?php
// newsletter-handler.php - Docket One Newsletter Subscription Handler
// Place this file in your root directory alongside contact-handler.php

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Check if JSON was parsed correctly
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Configuration - UPDATE THESE VALUES
$config = [
    'to_email' => 'newsletter@docket.one',        // Change to your email
    'from_email' => 'noreply@docket.one',         // Change to your domain
    'admin_name' => 'Docket One Newsletter',      // Your name/company
    'site_url' => 'https://docket.one',           // Your website URL
    'subscribers_file' => 'newsletter_subscribers.txt' // File to store subscribers
];

// Validate required fields
if (empty($input['email']) || trim($input['email']) === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Email address is required']);
    exit;
}

// Sanitize and validate email
$email = filter_var(trim($input['email']), FILTER_VALIDATE_EMAIL);
$source = htmlspecialchars(trim($input['source'] ?? 'website'), ENT_QUOTES, 'UTF-8');

if (!$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// Simple spam protection - check for suspicious patterns
if (preg_match('/[<>"\']/', $email) || strlen($email) > 254) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit;
}

// Rate limiting - simple IP-based check
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitFile = sys_get_temp_dir() . '/newsletter_rate_limit_' . md5($ip);
$currentTime = time();

if (file_exists($rateLimitFile)) {
    $lastSubmission = (int)file_get_contents($rateLimitFile);
    if (($currentTime - $lastSubmission) < 300) { // 5 minutes between submissions
        http_response_code(429);
        echo json_encode(['error' => 'Please wait before subscribing again']);
        exit;
    }
}

// Check if email is already subscribed
$subscribersFile = $config['subscribers_file'];
$isAlreadySubscribed = false;

if (file_exists($subscribersFile)) {
    $subscribers = file($subscribersFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($subscribers as $subscriber) {
        $subscriberData = json_decode($subscriber, true);
        if ($subscriberData && $subscriberData['email'] === $email) {
            $isAlreadySubscribed = true;
            break;
        }
    }
}

if ($isAlreadySubscribed) {
    echo json_encode([
        'success' => true,
        'message' => 'You\'re already subscribed to our newsletter!'
    ]);
    exit;
}

// Prepare subscription data
$subscriptionData = [
    'email' => $email,
    'source' => $source,
    'ip' => $ip,
    'timestamp' => date('Y-m-d H:i:s T'),
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
];

try {
    // Save subscriber to file
    $subscriberEntry = json_encode($subscriptionData) . "\n";
    if (file_put_contents($subscribersFile, $subscriberEntry, FILE_APPEND | LOCK_EX) === false) {
        throw new Exception('Failed to save subscriber data');
    }

    // Update rate limit file
    file_put_contents($rateLimitFile, $currentTime);

    // Send notification email to admin
    $notificationSubject = 'New Newsletter Subscription - Docket One';
    $notificationBody = "
New newsletter subscription received!

Email: $email
Source: $source
Subscribed: " . date('Y-m-d H:i:s T') . "
IP Address: $ip
User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "

---
Total subscribers: " . (count(file($subscribersFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES))) . "
";

    $notificationHeaders = [
        'From: ' . $config['admin_name'] . ' <' . $config['from_email'] . '>',
        'X-Mailer: Docket One Newsletter Handler',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8'
    ];

    mail(
        $config['to_email'],
        $notificationSubject,
        $notificationBody,
        implode("\r\n", $notificationHeaders)
    );

    // Send welcome email to subscriber
    sendWelcomeEmail($email, $config);

    // Log successful subscription
    $logEntry = date('Y-m-d H:i:s') . " - NEWSLETTER - $email subscribed from $source\n";
    error_log($logEntry, 3, 'newsletter.log');

    echo json_encode([
        'success' => true,
        'message' => 'Successfully subscribed! Welcome to the Docket One community.'
    ]);

} catch (Exception $e) {
    // Log error
    $errorLog = date('Y-m-d H:i:s') . " - NEWSLETTER ERROR - Failed to subscribe $email: " . $e->getMessage() . "\n";
    error_log($errorLog, 3, 'newsletter_errors.log');

    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to subscribe. Please try again later.',
        'debug' => $e->getMessage() // Remove this in production
    ]);
}

/**
 * Send welcome email to new subscriber
 */
function sendWelcomeEmail($email, $config) {
    $welcomeSubject = 'Welcome to Docket One! 🧮';
    
    $welcomeBody = "Welcome to the Docket One community!

Thanks for subscribing to our newsletter. You'll be the first to know about:

🆕 New calculators and tools
✨ Feature updates and improvements  
🎯 Tips and tricks for getting the most out of our calculators
🎉 Special announcements and behind-the-scenes content

What to expect:
• We'll only email you when we have something genuinely useful to share
• No spam, ever - we respect your inbox
• You can unsubscribe anytime (but we hope you'll stick around!)

In the meantime, explore our calculators:
{$config['site_url']}

Popular calculators to try:
• Caffeine Half-Life Calculator - Track your coffee intake
• Car vs. Uber Calculator - Make smart transportation decisions  
• Space Travel Time Calculator - Plan your interplanetary trips 🚀

Questions? Just reply to this email or visit our help page:
{$config['site_url']}/help.html

Welcome aboard!
The Docket One Team

---
You're receiving this because you subscribed at {$config['site_url']}
To unsubscribe, reply with 'UNSUBSCRIBE' in the subject line.";

    $welcomeHeaders = [
        'From: ' . $config['admin_name'] . ' <' . $config['from_email'] . '>',
        'X-Mailer: Docket One Newsletter Welcome',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8'
    ];

    // Send welcome email (don't throw error if this fails)
    mail($email, $welcomeSubject, $welcomeBody, implode("\r\n", $welcomeHeaders));
}
?>
