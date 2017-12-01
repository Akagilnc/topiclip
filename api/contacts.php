<?php
require "PHPMailer.php";
require "SMTP.php";
require "Exception.php";

//config setting
$host = 'smtp.sina.com';                  // Specify main and backup SMTP servers
$username = 'yuantianbingxue@sina.com';   // SMTP username
$password = 'ytbx2222222';                // SMTP password
$subject = 'TOPICLIPお問い合わせ';          //mail title
$SMTPSecure = 'tls';                      // Enable TLS encryption, `ssl` also accepted
$port = 25;                               // TCP port to connect to   gmail is 587

$senderMail = 'yuantianbingxue@sina.com';
$senderName = 'TOPICLIP';
$userEmail = $_POST['email'];
$userName = $_POST['name'];

$textarea = $_POST['question'];
$question = nl2br($textarea);
$adminBody = '<ul>' .
    '<li style="padding-bottom: 15px">御社名:<br><span style="padding-left: 20px">' . $_POST['company'] . '</span></li>' .
    '<li style="padding-bottom: 15px">ご担当者様名:<br><span style="padding-left: 20px">' . $_POST['name'] . '</span></li>' .
    '<li style="padding-bottom: 15px">メールアドレス:<br><span style="padding-left: 20px">' . $userEmail . '</span></li>' .
    '<li style="padding-bottom: 15px">電話番号:<br><span style="padding-left: 20px">' . $_POST['phone'] . '</span></li>' .
    '<li style="padding-bottom: 15px">ご質問:<br><span style="display:inline-block;padding-left: 20px">' . $question . '</span></li>'
    . '</ul>';

$userSubject = '【TOPICLIP】お問い合わせありがとうございます。';
$userBody = '
<p style="padding-bottom: 15px">お問い合わせありがとうございました。</p>
<p style="padding-bottom: 15px">この度はお問い合わせメールをお送りいただきありがとうございます。<br>
後ほど、担当者よりご連絡をさせていただきます。<br>
今しばらくお待ちくださいますようよろしくお願い申し上げます。</p>
<p>上記下に</p>';


$mail = new PHPMailer\PHPMailer\PHPMailer();               // Passing `true` enables exceptions

//send to admin
try {
    //Server settings
    $mail->CharSet = "utf-8";
    $mail->SMTPDebug = 2;                                 // Enable verbose debug output
    $mail->isSMTP();                                      // Set mailer to use SMTP
    $mail->Host = $host;
    $mail->SMTPAuth = true;                               // Enable SMTP authentication
    $mail->Username = $username;
    $mail->Password = $password;
    $mail->SMTPSecure = $SMTPSecure;
    $mail->Port = $port;

    //Recipients
    $mail->setFrom($senderMail, $senderName);
    $mail->addAddress($senderMail, $senderName);

    //Content
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $adminBody;
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
    $mail->send();

    $mail->addAddress($userEmail, $senderName);

    $mail->Subject = $userSubject;
    $mail->Body = $userBody;
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
    $mail->send();

    echo 'Message has been sent';
} catch (Exception $e) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
}

//send to user
//try {
//    //Server settings
//    $mail->CharSet = "utf-8";
//    $mail->SMTPDebug = 2;                                 // Enable verbose debug output
//    $mail->isSMTP();                                      // Set mailer to use SMTP
//    $mail->Host = $host;
//    $mail->SMTPAuth = true;                               // Enable SMTP authentication
//    $mail->Username = $username;
//    $mail->Password = $password;
//    $mail->SMTPSecure = $SMTPSecure;
//    $mail->Port = $port;

//    //Recipients
//    $mail->setFrom($senderMail, $senderName);
//    $mail->addAddress($userEmail, $senderName);
//
//    //Content
//    $mail->isHTML(true);
//    $mail->Subject = $subject;
//    $mail->Body = $userBody;
//    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
//    $mail->send();
//
//    echo 'Message has been sent';
//} catch (Exception $e) {
//    echo 'Message could not be sent.';
//    echo 'Mailer Error: ' . $mail->ErrorInfo;
//}
