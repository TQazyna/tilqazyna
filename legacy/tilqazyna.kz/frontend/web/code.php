<?php 
 // lang code for sidebar
 function sait_converter(){
$current_uri = $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"];
 $this_page_url = "http://" . $current_uri;
 $gtlink = "";

if ( isset($_REQUEST['sait']) ) {
 $KAZ_lang = $_REQUEST['sait'];
 } elseif ( isset($_COOKIE['KAZ_lang']) ) {
 $KAZ_lang = $_COOKIE['KAZ_lang'];
 } else {
 $KAZ_lang = $GLOBALS['hdr_lang'];

 }
 // check if exist $_GET
 if ( count($_GET) > 0 ) {
 if ( !isset($_GET['sait']) ) {
 $cc1 = '<a href="http://'.$current_uri.'&sait=kk">';
 $lc1 = '<a href="http://'.$current_uri.'&sait=lat">';
 $aa1 = '<a href="http://'.$current_uri.'&sait=ar">';
 } else {
 $cc1 = '<a href="http://'.str_replace( array("sait=lat", "sait=kk", "sait=ar"), 'sait=kk', $current_uri).'">';
 $lc1 = '<a href="http://'.str_replace( array("sait=lat", "sait=kk", "sait=ar"), 'sait=lat', $current_uri).'">';
 $aa1 = '<a href="http://'.str_replace( array("sait=lat", "sait=kk", "sait=ar"), 'sait=ar', $current_uri).'">';
 }
 } else {
 $cc1 = '<a href="?sait=kk">';
 $lc1 = '<a href="?sait=lat">';
 $aa1 = '<a href="?sait=ar">';
 }
 $cc2 = $lc2 = $aa2 = "</a>";

 switch($KAZ_lang) {
 case "kk": $cc1 = "<strong>"; $cc2 = "</strong>"; break;
 case "lat": $lc1 = "<strong>"; $lc2 = "</strong>"; break;
 case "ar":$aa1 = "<strong>"; $aa2 = "</strong>"; break;
 }

// Display GT link?

print <<<EOF
<!-- sait Translit Widget (list) -->
<ul class="sait_zhazu">
<li style="display:inline-block;margin-left:1px;">${cc1}&#x049A;&#x0430;&#x0437;&#x0430;&#x049B;${cc2}</li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<li style="display:inline-block;margin-left:3px;">${lc1}Lat&#x0131;n${lc2}</li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
// <li style="display:inline-block;margin-left:6px;">${aa1}&#x0642;&#x0627;&#x0632;&#x0627;&#x0642;${aa2}</li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
$gtlink
</ul>
<!-- /sait Translit Widget (list) -->
EOF;
};
?>