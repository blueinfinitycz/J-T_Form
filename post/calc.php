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

$formjmeno = trim(strip_tags($_REQUEST['form-jmeno']));
$formadresa = trim(strip_tags($_REQUEST['form-adresa']));
$formpsc = trim(strip_tags($_REQUEST['form-psc']));
$formmesto = trim(strip_tags($_REQUEST['form-mesto']));
$formtelefon = trim(strip_tags($_REQUEST['form-telefon']));
$formemail = trim(strip_tags($_REQUEST['form-email']));
$formic = trim(strip_tags($_REQUEST['form-ic']));
$formdic = trim(strip_tags($_REQUEST['form-dic']));
$formucet = trim(strip_tags($_REQUEST['form-ucet']));
$formbanka = trim(strip_tags($_REQUEST['form-banka']));
$formstorgan = trim(strip_tags($_REQUEST['form-storgan']));
$formstorgannar = trim(strip_tags($_REQUEST['form-storgannar']));
$formpredpod = trim(strip_tags($_REQUEST['form-predpod']));
$formdatpod = trim(strip_tags($_REQUEST['form-datpod']));
$formpodpredmet = trim(strip_tags($_REQUEST['form-pod-predmet']));
$formpodadresa = trim(strip_tags($_REQUEST['form-pod-adresa']));
$formpodpsc = trim(strip_tags($_REQUEST['form-pod-psc']));
$formpodmesto = trim(strip_tags($_REQUEST['form-pod-mesto']));
$formdodjmeno = trim(strip_tags($_REQUEST['form-dod-jmeno']));
$formdodadresa = trim(strip_tags($_REQUEST['form-dod-adresa']));
$formdodtelefon = trim(strip_tags($_REQUEST['form-dod-telefon']));
$formdodemail = trim(strip_tags($_REQUEST['form-dod-email']));

$check = $_REQUEST['surname'];
if ( $check != "" ) exit;

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
    //$mail->addAddress('malek@jtbank.cz', 'Petr Malek');     // Add a recipient

    //Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Žádost o kontakt z jtleasing.cz';
    $mail->Body = "Žádost o kontakt z jtleasing.cz od <br>\n<br>\n".$name."<br>\n".$email."<br>\n".$phone."<br>\n".$desc."<br>\n";
    $mail->AltBody = "Žádost o kontakt z jtleasing.cz od \n\n".$name."\n".$email."\n".$phone."\n".$desc."\n";

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
