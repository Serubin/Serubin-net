<?php
/*
 * Mail Script
 * To Be used with Solomon's Login Script 
 *
 *
 * Author: Serubin323 (Solomon Rubin)
 * Version: 1.0 - beta/dev
 * Do not distribute
 *
 *
 *
 * The following should not be touched unless you know what your doing, even then, don't.
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
 
require_once './mail/class.phpmailer.php';

define('GUSER', 'noreply@serubin.net'); // GMail username
define('GPWD', 'tntBlack!'); // GMail password

class mail{
	 
	function mailer($to, $from, $from_name, $subject, $body) { 
		global $error;
		$mail = new PHPMailer();  // create a new object
		$mail->IsSMTP(); // enable SMTP
		$mail->SMTPDebug = 0;  // debugging: 1 = errors and messages, 2 = messages only
		$mail->SMTPAuth = true;  // authentication enabled
		$mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for GMail
		$mail->Host = 'smtp.gmail.com';
		$mail->Port = 465; 
		$mail->Username = GUSER;  
		$mail->Password = GPWD;           
		$mail->IsHTML(true); 
		$mail->SetFrom($from, $from_name);
		$mail->Subject = $subject;
		$mail->Body = $body;
		$mail->AddAddress($to);
		if(!$mail->Send()) {
			return false;
		} else {
			return true;
		}
	}

	function send($sender_name, $sender_email, $subject, $body){
		return mailer("admin@serubin.net", "noreply@serubin.net", "$sender_name  @ Serubin.net Mailer: ", $subject, "<h2> $sender_name said: <h2> <br /><p>$body</p>");		
	}
}
?>