<?php
// test-mail.php - Simple mail test script
// Visit this file in your browser to test if mail is working

echo "<h1>PHP Mail Function Test</h1>";

// Check if mail function exists
if (!function_exists('mail')) {
    echo "<p style='color: red;'>❌ Mail function is NOT available on this server!</p>";
    echo "<p>This means PHP mail is not enabled. You'll need to:</p>";
    echo "<ul>";
    echo "<li>Enable PHP mail in your hosting control panel</li>";
    echo "<li>Configure SMTP settings</li>";
    echo "<li>Contact your hosting provider</li>";
    echo "</ul>";
    exit;
}

echo "<p style='color: green;'>✅ Mail function is available!</p>";

// Test email settings
$test_email = 'test@example.com'; // Change this to your email for testing
$subject = 'Test Email from Docket One';
$message = 'This is a test email to verify mail functionality is working.';
$headers = [
    'From: Docket One Test <noreply@docket.one>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8'
];

echo "<h2>Server Information:</h2>";
echo "<p><strong>Server:</strong> " . ($_SERVER['SERVER_SOFTWARE'] ?? 'Unknown') . "</p>";
echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";
echo "<p><strong>Mail Function:</strong> Available</p>";

// Check if this is a POST request (form submission)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['email'])) {
    $test_email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    
    if ($test_email) {
        echo "<h2>Sending Test Email...</h2>";
        
        $result = mail(
            $test_email,
            $subject,
            $message,
            implode("\r\n", $headers)
        );
        
        if ($result) {
            echo "<p style='color: green;'>✅ Test email sent successfully to: $test_email</p>";
            echo "<p>Check your inbox (and spam folder) for the test email.</p>";
        } else {
            echo "<p style='color: red;'>❌ Failed to send test email</p>";
            echo "<p>This indicates a mail server configuration issue.</p>";
        }
    } else {
        echo "<p style='color: red;'>❌ Invalid email address</p>";
    }
}

// Show test form
echo "<h2>Test Email Sending:</h2>";
echo "<form method='POST'>";
echo "<p><label>Your Email: <input type='email' name='email' required placeholder='your@email.com' style='padding: 5px; width: 200px;'></label></p>";
echo "<p><input type='submit' value='Send Test Email' style='padding: 10px 20px; background: #007cba; color: white; border: none; cursor: pointer;'></p>";
echo "</form>";

echo "<h2>Debugging Information:</h2>";
echo "<p>If emails are not being sent, check:</p>";
echo "<ul>";
echo "<li>PHP error logs</li>";
echo "<li>Mail server logs</li>";
echo "<li>Spam folders</li>";
echo "<li>Email server configuration (SMTP settings)</li>";
echo "<li>Domain DNS records (SPF, DKIM, DMARC)</li>";
echo "</ul>";

echo "<h2>Log Files to Check:</h2>";
echo "<p>These files may contain useful debugging information:</p>";
echo "<ul>";
echo "<li>newsletter_debug.log</li>";
echo "<li>contact_debug.log</li>";
echo "<li>newsletter_php_errors.log</li>";
echo "<li>contact_php_errors.log</li>";
echo "<li>newsletter.log</li>";
echo "<li>contact_form.log</li>";
echo "</ul>";

// Show recent log entries if they exist
$log_files = [
    'newsletter_debug.log',
    'contact_debug.log',
    'newsletter_php_errors.log',
    'contact_php_errors.log'
];

foreach ($log_files as $log_file) {
    if (file_exists($log_file) && filesize($log_file) > 0) {
        echo "<h3>Recent entries from $log_file:</h3>";
        echo "<pre style='background: #f0f0f0; padding: 10px; overflow: auto; max-height: 200px;'>";
        echo htmlspecialchars(tail($log_file, 10));
        echo "</pre>";
    }
}

// Function to get last N lines from a file
function tail($filename, $lines = 10) {
    $handle = fopen($filename, "r");
    if (!$handle) return "Could not open file";
    
    $linecounter = $lines;
    $pos = -2;
    $beginning = false;
    $text = array();
    
    while ($linecounter > 0) {
        $t = " ";
        while ($t != "\n") {
            if (fseek($handle, $pos, SEEK_END) == -1) {
                $beginning = true;
                break;
            }
            $t = fgetc($handle);
            $pos--;
        }
        $linecounter--;
        if ($beginning) {
            rewind($handle);
        }
        $text[$lines - $linecounter - 1] = fgets($handle);
        if ($beginning) break;
    }
    fclose($handle);
    return implode("", array_reverse($text));
}
?>
