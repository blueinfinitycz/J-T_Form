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

$formpredmet = trim(strip_tags($_REQUEST['form-predmet']));
$formcena = trim(strip_tags($_REQUEST['form-cena']));
$formsplatky = trim(strip_tags($_REQUEST['form-splatky']));
$formtelefon = trim(strip_tags($_REQUEST['form-telefon']));
$formemail = trim(strip_tags($_REQUEST['form-email']));
$formico = trim(strip_tags($_REQUEST['form-ico']));
$formfirma = trim(strip_tags($_REQUEST['form-firma']));
$formpredmetdesc = trim(strip_tags($_REQUEST["form-predmet-desc"]));

$check = $_REQUEST['surname'];
if ( $check != "" ) exit;

if ($formcena == '' || $formsplatky == '' || $formemail == '' || ( $formpredmet == "ostatní" &&  $formpredmetdesc == "" ) ) {
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
    //$mail->addAddress('obchod@jtleasing.cz', 'Info');     // Add a recipient
    $mail->addAddress('baca@jtfg.com', 'Ivan Baca');     // Add a recipient
    $mail->addAddress('tyrpak@jtleasing.cz', 'Tyrpák Josef');     // Add a recipient
    //$mail->addAddress('malek@jtbank.cz', 'Petr Malek');     // Add a recipient

    //Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Žádost o kontakt z jtleasing.cz';
    $mail->Body = "Žádost o kontakt z jtleasing.cz od <br>\n<br>\nEmail: ".$formemail."<br>\nPredmět: ".$formpredmet."<br>\nCena: ".$formcena."<br>\nSplatky: ".$formsplatky." m.<br>\nTelefon: ".$formtelefon."<br>\nICO: ".$formico."<br>\nFirma: ".$formfirma."<br>\nPredmet upřesnení: ".$formpredmetdesc."<br>\n";
    $mail->AltBody = "Žádost o kontakt z jtleasing.cz od \n\nEmail: ".$formemail."\n".$formpredmet."\nCena: ".$formcena."\Splatky: ".$formsplatky." m.\nTelefon: ".$formtelefon."\nICO: ".$formico."\nFirma: ".$formfirma."\nPredmet upřesnení: ".$formpredmetdesc."\n";

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

