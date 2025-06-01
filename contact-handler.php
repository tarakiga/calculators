<?php
// contact-handler.php - Docket One Contact Form Handler
// Place this file in your root directory alongside index.html

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'contact_php_errors.log');

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
$debug_log = "Contact Handler Debug - " . date('Y-m-d H:i:s') . "\n";
$debug_log .= "Request Method: " . $_SERVER['REQUEST_METHOD'] . "\n";
$debug_log .= "Content Type: " . ($_SERVER['CONTENT_TYPE'] ?? 'Not set') . "\n";
$debug_log .= "Raw Input: " . file_get_contents('php://input') . "\n";
file_put_contents('contact_debug.log', $debug_log, FILE_APPEND);

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
    'to_email' => 'support@docket.one',          // Change to your email
    'from_email' => 'noreply@docket.one',        // Change to your domain
    'admin_name' => 'Docket One Support',        // Your name/company
    'site_url' => 'https://docket.one'           // Your website URL
];

// Validate required fields
$required = ['firstName', 'email', 'subject', 'message', 'type'];
foreach ($required as $field) {
    if (empty($input[$field]) || trim($input[$field]) === '') {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize and validate inputs
$firstName = htmlspecialchars(trim($input['firstName']), ENT_QUOTES, 'UTF-8');
$lastName = htmlspecialchars(trim($input['lastName'] ?? ''), ENT_QUOTES, 'UTF-8');
$email = filter_var(trim($input['email']), FILTER_VALIDATE_EMAIL);
$subject = htmlspecialchars(trim($input['subject']), ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars(trim($input['message']), ENT_QUOTES, 'UTF-8');
$type = htmlspecialchars(trim($input['type']), ENT_QUOTES, 'UTF-8');
$calculator = htmlspecialchars(trim($input['calculator'] ?? ''), ENT_QUOTES, 'UTF-8');
$priority = htmlspecialchars(trim($input['priority'] ?? 'medium'), ENT_QUOTES, 'UTF-8');

// Validate email
if (!$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// Validate type
$validTypes = ['bug', 'feature', 'support', 'business'];
if (!in_array($type, $validTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid contact type']);
    exit;
}

// Simple spam protection - honeypot check
if (!empty($input['website'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Spam detected']);
    exit;
}

// Rate limiting - simple IP-based check
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitFile = sys_get_temp_dir() . '/docket_rate_limit_' . md5($ip);
$currentTime = time();

if (file_exists($rateLimitFile)) {
    $lastSubmission = (int)file_get_contents($rateLimitFile);
    if (($currentTime - $lastSubmission) < 60) { // 1 minute between submissions
        http_response_code(429);
        echo json_encode(['error' => 'Please wait before submitting another message']);
        exit;
    }
}

// Update rate limit file
file_put_contents($rateLimitFile, $currentTime);

// Format the email based on type
$typeLabels = [
    'bug' => '🐛 Bug Report',
    'feature' => '💡 Feature Request', 
    'support' => '❓ Support Request',
    'business' => '💼 Business Inquiry'
];

$typeLabel = $typeLabels[$type] ?? 'Contact Form';
$fullName = trim("$firstName $lastName");

// Email subject
$emailSubject = "[$typeLabel] $subject";

// Email body
$emailBody = "
$typeLabel from Docket One Contact Form
" . str_repeat('=', 50) . "

From: $fullName
Email: $email
Type: $typeLabel
Subject: $subject";

if ($calculator) {
    $emailBody .= "\nCalculator: $calculator";
}

if ($priority && $type === 'bug') {
    $emailBody .= "\nPriority: " . ucfirst($priority);
}

$emailBody .= "\n\nMessage:\n" . str_repeat('-', 20) . "\n$message\n" . str_repeat('-', 20);

$emailBody .= "\n\nTechnical Details:\n" . str_repeat('-', 20) . "
Submitted: " . date('Y-m-d H:i:s T') . "
IP Address: $ip
User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "
Referrer: " . ($_SERVER['HTTP_REFERER'] ?? 'Direct') . "
";

// Email headers
$headers = [
    'From: ' . $config['admin_name'] . ' <' . $config['from_email'] . '>',
    'Reply-To: ' . $fullName . ' <' . $email . '>',
    'Return-Path: ' . $config['from_email'],
    'X-Mailer: Docket One Contact Form',
    'X-Priority: 3',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit'
];

// Add priority header for urgent issues
if ($priority === 'urgent' && $type === 'bug') {
    $headers[] = 'X-Priority: 1';
    $headers[] = 'Importance: High';
}

try {
    // Test if mail function exists
    if (!function_exists('mail')) {
        throw new Exception('Mail function not available on this server');
    }
    
    file_put_contents('contact_debug.log', "Attempting to send email to: {$config['to_email']}\n", FILE_APPEND);
    
    // Attempt to send email
    $mailSent = mail(
        $config['to_email'],
        $emailSubject,
        $emailBody,
        implode("\r\n", $headers)
    );

    file_put_contents('contact_debug.log', "Mail function result: " . ($mailSent ? 'SUCCESS' : 'FAILED') . "\n", FILE_APPEND);

    if ($mailSent) {
        // Log successful submission
        $logEntry = date('Y-m-d H:i:s') . " - SUCCESS - $type from $email ($fullName)\n";
        error_log($logEntry, 3, 'contact_form.log');

        // Send auto-reply to user
        $autoReplyResult = sendAutoReply($email, $fullName, $type, $config);
        file_put_contents('contact_debug.log', "Auto-reply result: " . ($autoReplyResult ? 'SUCCESS' : 'FAILED') . "\n", FILE_APPEND);

        echo json_encode([
            'success' => true, 
            'message' => 'Message sent successfully! We\'ll get back to you within 24-48 hours.',
            'debug' => [
                'admin_email_sent' => $mailSent,
                'auto_reply_sent' => $autoReplyResult
            ]
        ]);
    } else {
        throw new Exception('Mail function returned false - check server mail configuration');
    }

} catch (Exception $e) {
    // Log error
    $errorLog = date('Y-m-d H:i:s') . " - ERROR - Failed to send email from $email: " . $e->getMessage() . "\n";
    error_log($errorLog, 3, 'contact_form_errors.log');

    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to send message. Please try again later or contact us directly.',
        'debug' => $e->getMessage() // Remove this in production
    ]);
}

/**
 * Send auto-reply confirmation email to the user
 */
function sendAutoReply($userEmail, $userName, $type, $config) {
    $typeResponses = [
        'bug' => 'We\'ll investigate this issue and get back to you with a fix or workaround.',
        'feature' => 'We\'ll review your suggestion and consider it for future updates.',
        'support' => 'Our support team will help you resolve this issue.',
        'business' => 'Our business team will review your inquiry and respond soon.'
    ];

    $typeResponse = $typeResponses[$type] ?? 'We\'ll review your message and respond accordingly.';

    $autoReplySubject = 'Thanks for contacting Docket One!';
    
    $autoReplyBody = "Hi $userName,

Thanks for reaching out to Docket One! We've received your message and wanted to confirm it arrived safely.

What happens next:
• $typeResponse
• You can expect a response within 24-48 hours
• For urgent issues, we'll prioritize accordingly

In the meantime:
• Check our Help & FAQ page: {$config['site_url']}/help.html
• Browse our calculators: {$config['site_url']}

Thanks for helping us make Docket One better!

Best regards,
The Docket One Team

---
This is an automated message. Please don't reply to this email.
For additional questions, submit a new message at {$config['site_url']}/contact.html";

    $autoReplyHeaders = [
        'From: ' . $config['admin_name'] . ' <' . $config['from_email'] . '>',
        'X-Mailer: Docket One Auto-Reply',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8'
    ];

    // Send auto-reply and return result
    return mail($userEmail, $autoReplySubject, $autoReplyBody, implode("\r\n", $autoReplyHeaders));
}
?>
