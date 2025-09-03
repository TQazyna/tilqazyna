<?php
namespace common\components\MyLib;
use common\models\Articles;
use Yii;
use yii\base\Component;
use yii\base\InvalidConfigException;
use common\models\NewsCategory;
class MyLib extends Component{

    public static function preg_url($st){
        $subject = $st;
        $pattern = '/[^a-zA-Z0-9-]/';
        return preg_replace($pattern,"",$subject);
    }
    public static function translit($str) {
        $translit = array(
            'А' => 'a',
            'Ә' => 'a',
            'Б' => 'b',
            'В' => 'v',
            'Г' => 'g',
            'Ғ' => 'g',
            'Д' => 'd',
            'Е' => 'e',
            'Ё' => 'yo',
            'Ж' => 'zh',
            'З' => 'z',
            'И' => 'i',
            'Й' => 'i',
            'К' => 'k',
            'Қ' => 'k',
            'Л' => 'l',
            'М' => 'm',
            'Н' => 'n',
            'Ң' => 'n',
            'О' => 'o',
            'Ө' => 'o',
            'П' => 'p',
            'Р' => 'r',
            'С' => 's',
            'Т' => 't',
            'У' => 'u',
            'Ұ' => 'u',
            'Ү' => 'u',
            'Ф' => 'f',
            'Х' => 'h',
            'Һ' => 'h',
            'Ц' => 'ts',
            'Ч' => 'ch',
            'Ш' => 'sh',
            'Щ' => 'sch',
            'Ъ' => '',
            'Ы' => 'y',
            'І' => 'y',
            'Ь' => '',
            'Э' => 'e',
            'Ю' => 'yu',
            'Я' => 'ya',
            'а' => 'a',
            'ә' => 'a',
            'б' => 'b',
            'в' => 'v',
            'г' => 'g',
            'ғ' => 'g',
            'д' => 'd',
            'е' => 'e',
            'ё' => 'yo',
            'ж' => 'zh',
            'з' => 'z',
            'и' => 'i',
            'й' => 'i',
            'к' => 'k',
            'қ' => 'k',
            'л' => 'l',
            'м' => 'm',
            'н' => 'n',
            'ң' => 'n',
            'о' => 'o',
            'ө' => 'o',
            'п' => 'p',
            'р' => 'r',
            'с' => 's',
            'т' => 't',
            'у' => 'u',
            'ұ' => 'u',
            'ү' => 'u',
            'ф' => 'f',
            'х' => 'h',
            'һ' => 'h',
            'ц' => 'ts',
            'ч' => 'ch',
            'ш' => 'sh',
            'щ' => 'sch',
            'ъ' => '',
            'ы' => 'y',
            'і' => 'y',
            'ь' => '',
            'э' => 'e',
            'ю' => 'yu',
            'я' => 'ya',
            ' ' => '-',
            '!' => '',
            '?' => '',
            '('=> '',
            ')' => '',
            '#' => '',
            ',' => '',
            '№' => '',
            ' - '=>'-',
            '/'=>'-',
            '  '=>'-',
            'A' => 'a',
            'B' => 'b',
            'C' => 'c',
            'D' => 'd',
            'E' => 'e',
            'F' => 'f',
            'G' => 'g',
            'H' => 'h',
            'I' => 'i',
            'J' => 'j',
            'K' => 'k',
            'L' => 'l',
            'M' => 'm',
            'N' => 'n',
            'O' => 'o',
            'P' => 'p',
            'Q' => 'q',
            'R' => 'r',
            'S' => 's',
            'T' => 't',
            'U' => 'u',
            'V' => 'v',
            'W' => 'w',
            'X' => 'x',
            'Y' => 'y',
            'Z' => 'z'
        );
        return self::preg_url(strtr($str, $translit));
    }
    public static function setLink($id,$title,$cat_id) {
        $cat_alias = NewsCategory::catAlias($cat_id);
        $text = self::translit($title);
        return 'news/'.$cat_alias.'/'.$id.'-'.$text.'.html';
    }
    public static function rusdate($date){
        $dates = explode('-',$date);
        $month = $dates[1];
        $day = $dates[2];
        $year = $dates[0];
        $time = $dates[3];
        switch($month){
            case '01':
                $rusmonth = 'Января';
                break;
            case '02':
                $rusmonth = 'Февраля';
                break;
            case '03':
                $rusmonth = 'Марта';
                break;
            case '04':
                $rusmonth = 'Апреля';
                break;
            case '05':
                $rusmonth = 'Мая';
                break;
            case '06':
                $rusmonth = 'Июня';
                break;
            case '07':
                $rusmonth = 'Июля';
                break;
            case '08':
                $rusmonth = 'Августа';
                break;
            case '09':
                $rusmonth = 'Сентября';
                break;
            case '10':
                $rusmonth = 'Октября';
                break;
            case '11':
                $rusmonth = 'Ноября';
                break;
            case '12':
                $rusmonth = 'Декабря';
                break;
        }
        return $rusdate = $day." ".$rusmonth.", ".$year."г. ".$time;
    }
    public static function rusdateCalendar($date){
        $dates = explode('-',$date);
        $month = $dates[1];
        $day = $dates[0];
        $year = $dates[2];
       
        switch($month){
            case '1':
                $rusmonth = 'Января';
                break;
            case '2':
                $rusmonth = 'Февраля';
                break;
            case '3':
                $rusmonth = 'Марта';
                break;
            case '4':
                $rusmonth = 'Апреля';
                break;
            case '5':
                $rusmonth = 'Мая';
                break;
            case '6':
                $rusmonth = 'Июня';
                break;
            case '7':
                $rusmonth = 'Июля';
                break;
            case '8':
                $rusmonth = 'Августа';
                break;
            case '9':
                $rusmonth = 'Сентября';
                break;
            case '10':
                $rusmonth = 'Октября';
                break;
            case '11':
                $rusmonth = 'Ноября';
                break;
            case '12':
                $rusmonth = 'Декабря';
                break;
        }
        return $rusdate = $day."  ".$rusmonth."  ".$year." года ";
    }
    public static function rusdateDayMonth($date){
        $dates = explode('-',$date);
        $month = $dates[1];
        $day = $dates[2];
        switch($month){
            case '01':
                $rusmonth = 'Января';
                break;
            case '02':
                $rusmonth = 'Февраля';
                break;
            case '03':
                $rusmonth = 'Марта';
                break;
            case '04':
                $rusmonth = 'Апреля';
                break;
            case '05':
                $rusmonth = 'Мая';
                break;
            case '06':
                $rusmonth = 'Июня';
                break;
            case '07':
                $rusmonth = 'Июля';
                break;
            case '08':
                $rusmonth = 'Августа';
                break;
            case '09':
                $rusmonth = 'Сентября';
                break;
            case '10':
                $rusmonth = 'Октября';
                break;
            case '11':
                $rusmonth = 'Ноября';
                break;
            case '12':
                $rusmonth = 'Декабря';
                break;
        }
        return $rusdate = $day." ".$rusmonth;
    }
    public static function getRole($id){
        if($id == 1){
            return "Автор";
        }elseif($id == 2){
            return "Әдіскер";
        }elseif($id == 3){
            return "Ғалым";
        }
    }
    public static function getImg($id){
        $art = Articles::findOne($id);
        $youtube = $art['link'];
        $youtube = explode('/',$youtube);
        $c = count($youtube)-1;
        $idvid = $youtube[$c];
       return $link = "https://i.ytimg.com/vi/".$idvid."/hqdefault.jpg";
    }
    public static function getLink($id){
        $art = Articles::findOne($id);
        $youtube = $art['link'];
        $youtube = explode('/',$youtube);
        $c = count($youtube)-1;
        return $idvid = $youtube[$c];
    }
    public static function getCatName($id){
        switch ($id){
            case 13:
                return "Тіл райы";
            break;
            case 14:
                return "Толғаныс";
                break;
            case 15:
                return "Видеосабақтар";
                break;
            case 16:
                return "Ғалымнан кеңес";
                break;
            case 17:
                return "Әдіскерге көмек";
                break;
            case 18:
                return "Аудиосабақтар";
                break;
            case 11:
                return "Ақпарат";
                break;
            case 12:
                return "Әдіс";
                break;
        }
    }

}