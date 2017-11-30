<?php
mb_language("Japanese");
mb_internal_encoding("UTF-8");

// global functions.
function error_json_output($errors, $code = 400)
{
    if (!empty($errors)) {
        header("HTTP/1.1 ${code}");
        echo json_encode($errors);
        die(0);
    }
}

// global members.
$to = 'oomura@royt.co.jp';
$subject = 'TOPICLIPお問い合わせ';
$senderName = 'TOPICLIP';

$additional_headers='';

$textarea = $_POST['question'];
$question = nl2br($textarea);
$message = '<ul>' .
    '<li style="padding-bottom: 15px">御社名:<br><span style="padding-left: 20px">' . $_POST['company'] . '</span></li>' .
    '<li style="padding-bottom: 15px">ご担当者様名:<br><span style="padding-left: 20px">' . $_POST['name'] . '</span></li>' .
    '<li style="padding-bottom: 15px">メールアドレス:<br><span style="padding-left: 20px">' . $_POST['email'] . '</span></li>' .
    '<li style="padding-bottom: 15px">電話番号:<br><span style="padding-left: 20px">' . $_POST['phone'] . '</span></li>' .
    '<li style="padding-bottom: 15px">ご質問:<br><span style="display:inline-block;padding-left: 20px">' . $question . '</span></li>'
    . '</ul>';

$errors = array();




$admin_mail                 = 'oomura@royt.co.jp';
$admin_mail_title           = 'お問い合わせがありました';
$admin_mail_body_template   = 'お問い合わせがありました';
$admin_mail_from_addr       = 'oomura@royt.co.jp';

$admin_mail_from_name       = '株式会社シャリオン';

$user_mail_from_addr        = 'oomura@royt.co.jp';

$user_mail_from_name        = '株式会社シャリオン';
$user_mail_body_template    = 'お問い合わせありがとうございます。';
$errors                     = array();

// send mail to admin.
if (!mb_send_mail($to, $subject,  $message,$additional_headers, "From:" . mb_encode_mimeheader($admin_mail_from_name) . " <${admin_mail_from_addr}>")) {
    $errors[] = '送信処理に失敗しました';
    var_dump('asd');
    error_json_output($errors, 500);
}

echo json_encode(array('メール送信が完了しました。'));