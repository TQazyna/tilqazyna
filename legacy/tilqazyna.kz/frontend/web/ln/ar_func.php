
<?php
// Cyr to Ar
function tote($kaz) {{
$kaz = str_replace("лле" ,"لە", $kaz);
$kaz = str_replace("“" ,"&#x201D;", $kaz);
$kaz = str_replace("”" ,"&#x201C;", $kaz);
$kaz = str_replace("," ,"&#1548;", $kaz);
$kaz = str_replace("А" ,"ا", $kaz);
$kaz = str_replace("Ә" ,"ا", $kaz);
$kaz = str_replace("Б" ,"ب", $kaz);
$kaz = str_replace("В" ,"ۆ", $kaz);
$kaz = str_replace("Г" ,"گ", $kaz);
$kaz = str_replace("Ғ" ,"ع", $kaz);
$kaz = str_replace("Д" ,"د", $kaz);
$kaz = str_replace("Е" ,"ە", $kaz);
$kaz = str_replace("Ж" ,"ج", $kaz);
$kaz = str_replace("З" ,"ز", $kaz);
$kaz = str_replace("И" ,"ي", $kaz);
$kaz = str_replace("Й" ,"ي", $kaz);
$kaz = str_replace("К" ,"ك", $kaz);
$kaz = str_replace("Қ" ,"ق", $kaz);
$kaz = str_replace("Л" ,"ل", $kaz);
$kaz = str_replace("М" ,"م", $kaz);
$kaz = str_replace("Н" ,"ن", $kaz);
$kaz = str_replace("Ң" ,"ڭ", $kaz);
$kaz = str_replace("О" ,"و", $kaz);
$kaz = str_replace("Ө" ,"و", $kaz);
$kaz = str_replace("П" ,"پ", $kaz);
$kaz = str_replace("Р" ,"ر", $kaz);
$kaz = str_replace("С" ,"س", $kaz);
$kaz = str_replace("Т" ,"ت", $kaz);
$kaz = str_replace("У" ,"ۋ", $kaz);
$kaz = str_replace("Ұ" ,"ۇ", $kaz);
$kaz = str_replace("Ү" ,"ۇ", $kaz);
$kaz = str_replace("Ф" ,"ف", $kaz);
$kaz = str_replace("Х" ,"ح", $kaz);
$kaz = str_replace("Һ" ,"ھ", $kaz);
$kaz = str_replace("Ц" ,"تس", $kaz);
$kaz = str_replace("Ч" ,"چ", $kaz);
$kaz = str_replace("Ш" ,"ش", $kaz);
$kaz = str_replace("Щ" ,"شش", $kaz);
$kaz = str_replace("Ы" ,"ى", $kaz);
$kaz = str_replace("І" ,"ى", $kaz);
$kaz = str_replace("Э" ,"ە", $kaz);
$kaz = str_replace("Ъ" ,"", $kaz);
$kaz = str_replace("Ь" ,"", $kaz);
$kaz = str_replace("Ю" ,"يۋ", $kaz);
$kaz = str_replace("Я" ,"يا", $kaz);
$kaz = str_replace("Ё" ,"يو", $kaz);
$kaz = str_replace("ءء" ,"ء", $kaz);
$kaz = str_replace("а" ,"ا", $kaz);
$kaz = str_replace("ә" ,"ا", $kaz);
$kaz = str_replace("б" ,"ب", $kaz);
$kaz = str_replace("в" ,"ۆ", $kaz);
$kaz = str_replace("г" ,"گ", $kaz);
$kaz = str_replace("ғ" ,"ع", $kaz);
$kaz = str_replace("д" ,"د", $kaz);
$kaz = str_replace("е" ,"ە", $kaz);
$kaz = str_replace("ж" ,"ج", $kaz);
$kaz = str_replace("з" ,"ز", $kaz);
$kaz = str_replace("и" ,"ي", $kaz);
$kaz = str_replace("й" ,"ي", $kaz);
$kaz = str_replace("к" ,"ك", $kaz);
$kaz = str_replace("қ" ,"ق", $kaz);
$kaz = str_replace("л" ,"ل", $kaz);
$kaz = str_replace("м" ,"م", $kaz);
$kaz = str_replace("н" ,"ن", $kaz);
$kaz = str_replace("ң" ,"ڭ", $kaz);
$kaz = str_replace("о" ,"و", $kaz);
$kaz = str_replace("ө" ,"و", $kaz);
$kaz = str_replace("п" ,"پ", $kaz);
$kaz = str_replace("р" ,"ر", $kaz);
$kaz = str_replace("с" ,"س", $kaz);
$kaz = str_replace("т" ,"ت", $kaz);
$kaz = str_replace("у" ,"ۋ", $kaz);
$kaz = str_replace("ұ" ,"ۇ", $kaz);
$kaz = str_replace("ү" ,"ۇ", $kaz);
$kaz = str_replace("ф" ,"ف", $kaz);
$kaz = str_replace("х" ,"ح", $kaz);
$kaz = str_replace("һ" ,"ھ", $kaz);
$kaz = str_replace("ц" ,"تس", $kaz);
$kaz = str_replace("ч" ,"چ", $kaz);
$kaz = str_replace("ш" ,"ش", $kaz);
$kaz = str_replace("щ" ,"شش", $kaz);
$kaz = str_replace("ы" ,"ى", $kaz);
$kaz = str_replace("і" ,"ى", $kaz);
$kaz = str_replace("э" ,"ە", $kaz);
$kaz = str_replace("ъ" ,"", $kaz);
$kaz = str_replace("ь" ,"", $kaz);
$kaz = str_replace("ю" ,"يۋ", $kaz);
$kaz = str_replace("я" ,"يا", $kaz);
$kaz = str_replace("ё " ,"يو", $kaz);

$arb = array(	'/\?/' => '؟', '/([A-Za-z0-9"\/])؟/' => '$1?',
			);
//  [ ء ]
			$matches = preg_split( '/[\b\s\-\.:,>«]+/', $kaz, -1, PREG_SPLIT_OFFSET_CAPTURE);
			$mstart = 0;
			$ret = '';
			 
			foreach( $matches as $m ) {
				$ret .= substr( $kaz, $mstart, $m[1] - $mstart );
				
				if ( preg_match('/[әөүіӘӨҮІ]/u', $m[0]) && !preg_match('/[еэгғкқЕЭГҒКҚ]/u', $m[0]) )
				{
					$ret .= 'ء'.$m[0];
				} else {
					$ret .= $m[0];
				}
				$mstart = $m[1] + strlen($m[0]);
			}
			
			
			// Convert Text
			$kaz =& $ret;
			foreach( $arb as $k => $v ) {
				$kaz = preg_replace( $k, $v, $kaz );
			}
			// Arabic text results
			return $kaz;

		   }
return $kaz;
}
ob_start('tote');
?>
