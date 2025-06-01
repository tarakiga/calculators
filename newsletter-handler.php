<?php
// newsletter-handler.php - Docket One Newsletter Subscription Handler
// Enhanced with better debugging and error handling

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'newsletter_php_errors.log');

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

// Log incoming request for debugging
$debug_log = "Newsletter Handler Debug - " . date('Y-m-d H:i:s') . "\n";
$debug_log .= "Request Method: " . $_SERVER['REQUEST_METHOD'] . "\n";
$debug_log .= "Content Type: " . ($_SERVER['CONTENT_TYPE'] ?? 'Not set') . "\n";
$debug_log .= "Raw Input: " . file_get_contents('php://input') . "\n";
file_put_contents('newsletter_debug.log', $debug_log, FILE_APPEND);

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Check if JSON was parsed correctly
if (json_last_error() !== JSON_ERROR_NONE) {
    $error = 'Invalid JSON data: ' . json_last_error_msg();
    file_put_contents('newsletter_debug.log', "JSON Error: $error\n", FILE_APPEND);
    http_response_code(400);
    echo json_encode(['error' => $error]);
    exit;
}

// Configuration - UPDATE THESE VALUES FOR YOUR SERVER
$config = [
    'to_email' => 'newsletter@docket.one',        // Change to your email
    'from_email' => 'noreply@docket.one',         // Change to your domain
    'admin_name' => 'Docket One Newsletter',      // Your name/company
    'site_url' => 'https://docket.one',           // Your website URL
    'subscribers_file' => 'newsletter_subscribers.txt', // File to store subscribers
    'smtp_debug' => true                          // Enable SMTP debugging
];

// Test if we can write to the subscribers file
if (!is_writable(dirname($config['subscribers_file']))) {
    $error = 'Directory not writable: ' . dirname($config['subscribers_file']);
    file_put_contents('newsletter_debug.log', "Write Error: $error\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error', 'debug' => $error]);
    exit;
}

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

// Log the email being processed
file_put_contents('newsletter_debug.log', "Processing email: $email from source: $source\n", FILE_APPEND);

// Simple spam protection
if (preg_match('/[<>"\']/', $email) || strlen($email) > 254) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit;
}

// Rate limiting
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitFile = sys_get_temp_dir() . '/newsletter_rate_limit_' . md5($ip);
$currentTime = time();

if (file_exists($rateLimitFile)) {
    $lastSubmission = (int)file_get_contents($rateLimitFile);
    if (($currentTime - $lastSubmission) < 60) { // Reduced to 1 minute for testing
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
        if (strpos($subscriber, '#') === 0) continue; // Skip comment lines
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
    $writeResult = file_put_contents($subscribersFile, $subscriberEntry, FILE_APPEND | LOCK_EX);
    
    if ($writeResult === false) {
        throw new Exception('Failed to save subscriber data to file');
    }
    
    file_put_contents('newsletter_debug.log', "Subscriber data saved successfully\n", FILE_APPEND);

    // Update rate limit file
    file_put_contents($rateLimitFile, $currentTime);

    // Test mail function availability
    if (!function_exists('mail')) {
        throw new Exception('Mail function not available on this server');
    }

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
Total subscribers: " . (count(file($subscribersFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES)) - 3) . " (excluding header lines)
";

    $notificationHeaders = [
        'From: ' . $config['admin_name'] . ' <' . $config['from_email'] . '>',
        'Reply-To: ' . $config['from_email'],
        'X-Mailer: Docket One Newsletter Handler',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8'
    ];

    $adminMailResult = mail(
        $config['to_email'],
        $notificationSubject,
        $notificationBody,
        implode("\r\n", $notificationHeaders)
    );

    file_put_contents('newsletter_debug.log', "Admin email result: " . ($adminMailResult ? 'SUCCESS' : 'FAILED') . "\n", FILE_APPEND);

    // Send welcome email to subscriber
    $welcomeMailResult = sendWelcomeEmail($email, $config);
    file_put_contents('newsletter_debug.log', "Welcome email result: " . ($welcomeMailResult ? 'SUCCESS' : 'FAILED') . "\n", FILE_APPEND);

    // Log successful subscription
    $logEntry = date('Y-m-d H:i:s') . " - NEWSLETTER SUCCESS - $email subscribed from $source (Admin: " . ($adminMailResult ? 'sent' : 'failed') . ", Welcome: " . ($welcomeMailResult ? 'sent' : 'failed') . ")\n";
    error_log($logEntry, 3, 'newsletter.log');

    echo json_encode([
        'success' => true,
        'message' => 'Successfully subscribed! Welcome to the Docket One community.',
        'debug' => [
            'admin_email_sent' => $adminMailResult,
            'welcome_email_sent' => $welcomeMailResult,
            'file_written' => true
        ]
    ]);

} catch (Exception $e) {
    // Log error
    $errorLog = date('Y-m-d H:i:s') . " - NEWSLETTER ERROR - Failed to subscribe $email: " . $e->getMessage() . "\n";
    error_log($errorLog, 3, 'newsletter_errors.log');
    file_put_contents('newsletter_debug.log', "Exception: " . $e->getMessage() . "\n", FILE_APPEND);

    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to subscribe. Please try again later.',
        'debug' => $e->getMessage()
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
        'Reply-To: ' . $config['from_email'],
        'X-Mailer: Docket One Newsletter Welcome',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8'
    ];

    // Send welcome email and return result
    return mail($email, $welcomeSubject, $welcomeBody, implode("\r\n", $welcomeHeaders));
}
?>
