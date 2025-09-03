<?php
namespace common\components\Lib;
use Yii;
use yii\base\Component;

class Lib extends Component{

    public function preg_url($st){
        $subject = $st;
        $pattern = '/[^a-zA-Z0-9-]/';
        return preg_replace($pattern,"",$subject);
    }
    public function translit($str) {
        $translit = array(
            'А' => 'a', 'Б' => 'b', 'В' => 'v', 'Г' => 'g', 'Д' => 'd', 'Е' => 'e', 'Ё' => '', 'Ж' => 'j', 'З' => 'z',
            'И' => 'ı', 'Й' => 'ı', 'К' => 'k', 'Л' => 'l', 'М' => 'm', 'Н' => 'n', 'О' => 'o', 'П' => 'p', 'Р' => 'r',
            'С' => 's', 'Т' => 't', 'У' => 'ý', 'Ф' => 'f', 'Х' => 'h', 'Ц' => 'ts', 'Ч' => 'ch', 'Ш' => 'sh', 'Щ' => '',
            'Ъ' => '', 'Ы' => 'y', 'Ь' => '', 'Э' => 'e', 'Ю' => 'ıý', 'Я' => 'ıa',
            'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd', 'е' => 'e', 'ё' => '', 'ж' => 'j', 'з' => 'z',
            'и' => 'ı', 'й' => 'ı', 'к' => 'k', 'л' => 'l', 'м' => 'm', 'н' => 'n', 'о' => 'o', 'п' => 'p', 'р' => 'r',
            'с' => 's', 'т' => 't', 'у' => 'ý', 'ф' => 'f', 'х' => 'h', 'ц' => 'ts', 'ч' => 'ch', 'ш' => 'sh', 'щ' => '',
            'ъ' => '', 'ы' => 'y', 'ь' => '', 'э' => 'e', 'ю' => 'ıý', 'я' => 'ıa',
            ' ' => '-', '!' => '', '?' => '', '('=> '', ')' => '', '#' => '', ',' => '', '№' => '',' - '=>'-','/'=>'-', '  '=>'-',
            'A' => 'a', 'B' => 'b', 'C' => 'c', 'D' => 'd', 'E' => 'e', 'F' => 'f', 'G' => 'g', 'H' => 'h', 'I' => 'i', 'J' => 'j', 'K' => 'k', 'L' => 'l', 'M' => 'm', 'N' => 'n',
            'O' => 'o', 'P' => 'p', 'Q' => 'q', 'R' => 'r', 'S' => 's', 'T' => 't', 'U' => 'u', 'V' => 'v', 'W' => 'w', 'X' => 'x', 'Y' => 'y', 'Z' => 'z'
        );
        return self::preg_url(strtr($str, $translit));
    }
    public function setLink($id,$title,$cat_id) {
        $cat_alias = NewsCategory::catAlias($cat_id);
        $text = self::translit($title);
        return 'news/'.$cat_alias.'/'.$id.'-'.$text.'.html';
    }
    public function rusdate($date){
        $dates = explode('-',$date);
        $month = $dates[1];
        $day = $dates[0];
        $year = $dates[2];

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
        return $rusdate = $day." ".$rusmonth.", ".$year."г.";
    }


}