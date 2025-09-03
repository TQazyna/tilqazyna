<?php
 // Авторы: Өркен Мұсабекұлы, руқсатсыз пайдалануға болмайды
session_start();
header('Cache-control: private'); // IE 6 FIX
if(isSet($_GET['sait']))
{
$lang = $_GET['sait'];
// register the session and set the cookie
$_SESSION['sait'] = $lang;

setcookie("lang", $lang, time() + (3600 * 24 * 30));
}
else if(isSet($_SESSION['sait']))
{
$lang = $_SESSION['sait'];
}
else if(isSet($_COOKIE['sait']))
{
$lang = $_COOKIE['sait'];
}
else
{
$lang = 'kk';
}
switch ($lang) {
  case 'kk':
  $lang_file = 'kk.php';
  break;

  case 'lat':
  $lang_file = 'lat.php';
  break;
   case 'ar':
  $lang_file = 'ar.php';
  break;
  default:
  $lang_file = 'kk.php';
}
include_once 'ln/'.$lang_file;

?>