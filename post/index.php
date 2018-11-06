<?php

header('Access-Control-Allow-Origin: *', false);
header('Content-type: application/json');
header_remove('X-Frame-Options');

// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//Load composers autoloader
require 'src/PHPMailer.php';
require 'src/Exception.php';
require 'src/SMTP.php';

$name = trim(strip_tags($_REQUEST['userName']));
$email = trim(strip_tags($_REQUEST['email']));
$phone = trim(strip_tags($_REQUEST['phone']));

if ($name == '' || ($email == '' && $phone == '')) {
    echo 'myJsonMethod('.json_encode(array('message' => 'empty', 'error' => 'Missing data'), JSON_HEX_APOS).')';
    exit;
}

$mail = new PHPMailer(true);                              // Passing `true` enables exceptions
try {
    //Server settings
    $mail->SMTPDebug = 0;                                 // Enable verbose debug output
    $mail->isSMTP();                                      // Set mailer to use SMTP
    $mail->Host = 'smtpserver';  // Specify main and backup SMTP servers
    $mail->SMTPAuth = false;                               // Enable SMTP authentication
    $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
    $mail->CharSet = 'UTF-8';

    //Recipients
    $mail->setFrom('jtleasing@jtb.com', 'JTLeasing');
    //$mail->addAddress('info@jtleasing.cz', 'Info');     // Add a recipient
    $mail->addAddress('baca@jtfg.com', 'Ivan Baca');     // Add a recipient
    $mail->addAddress('malek@jtbank.cz', 'Petr Malek');     // Add a recipient

    //Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Žádost o kontakt z jtleasing.cz';
    $mail->Body = "Žádost o kontakt z jtleasing.cz od <br>\n<br>\n".$name."<br>\n".$email."<br>\n".$phone."<br>\n";
    $mail->AltBody = "Žádost o kontakt z jtleasing.cz od \n\n".$name."\n".$email."\n".$phone."\n";

    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true,
        ),
    );

    $mail->send();
    echo 'myJsonMethod('.json_encode(array('message' => 'Message has been sent', 'error' => ''), JSON_HEX_APOS).')';
} catch (Exception $e) {
    echo 'myJsonMethod('.json_encode(array('message' => 'Message could not be sent. Mailer Error: '.$mail->ErrorInfo, 'error' => 'Error sending')).')';
}
