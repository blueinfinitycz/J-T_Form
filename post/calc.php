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
    $mail->setFrom('jtleasing@jtb.com', 'J&T Leasing');
    //$mail->addAddress('obchod@jtleasing.cz', 'Info');     // Add a recipient
    if ( strpos( $_SERVER['HTTP_REFERER'], "localhost" ) !== false ) {
        $mail->addAddress('baca@jtfg.com', 'Ivan Baca');     // Add a recipient
    } else {
        if ( strpos( $_SERVER['HTTP_REFERER'], "hcfintest.cz" ) !== false ) {
	        $mail->addAddress('baca@jtfg.com', 'Ivan Baca');     // Add a recipient
            $mail->addAddress('info@jtleasing.cz', 'Tyrpák Josef');     // Add a recipient
        } else {
            $mail->addAddress('obchod@jtleasing.cz', 'J&T Leasing');     // Add a recipient
        }
    }
    //$mail->addAddress('malek@jtbank.cz', 'Petr Malek');     // Add a recipient

    //Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Žádost o kontakt z jtleasing.cz';
    $mail->Body = "Kontaktujte, prosím, níže uvedeného žadatele s nabídkou operativního leasingu. <br>\n<br>\nEmail žadatele: ".$formemail."<br>\nPredmět OL: ".$formpredmet."<br>\nUpřesnění předmětu OL: ".$formpredmetdesc."<br>\nCena OL: ".$formcena."<br>\nPožadované splátky: ".$formsplatky." m.<br>\nTelefon žadatele: ".$formtelefon."<br>\nIČO firmy žadatele: ".$formico."<br>\nFirma žadatele: ".$formfirma."<br>\n";
    $mail->AltBody = "Kontaktujte, prosím, níže uvedeného žadatele s nabídkou operativního leasingu. \n\nEmail žadatele: ".$formemail."\nPredmět OL: ".$formpredmet."\nUpřesnění předmětu OL: ".$formpredmetdesc."\nCena OL: ".$formcena."\nPožadované splátky: ".$formsplatky." m.\nTelefon žadatele: ".$formtelefon."\nIČO firmy žadatele: ".$formico."\nFirma žadatele: ".$formfirma."\n";

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

