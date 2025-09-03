<?php

namespace app\modules\main\controllers;

use common\models\Articles;
use common\models\Books;
use common\models\Category;
use common\models\Info;
use common\models\User;
use frontend\models\SignupForm;
use frontend\models\ContactForm;
use common\models\LoginForm;
use yii\base\Response;
use yii\helpers\Url;
use yii\web\Controller;
use yii\web\UrlManager;
use yii\widgets\ActiveForm;
use frontend\components\Common;

class SearchController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex()
    {
        $get = \Yii::$app->request->get();

        //if (!empty($get)) {
		if (strlen($get['search']) > 0) {

            $asd = $get['search'];
            $newss = Articles::find()->where(['like', 'text', $asd])->all();
            $results = array();
mb_internal_encoding("UTF-8");
            foreach ($newss as $news) {
                $title = $news['title'];
                $link = "/article/".$news['id'];
                $text = strip_tags($news['text']);
                $pos1 = mb_strpos($text, $asd);
                $des =  mb_substr($text, $pos1-10, 300);
                $des = str_replace($asd, "<strong style='font-weight: 700;'>$asd</strong>", $des);
                $des = "... ".$des." ...";
                $results[] = array("title"=>$title,'link'=>$link,'des'=>$des);
            }


            $calendars = Books::find()->where(['like', 'des', $asd])->all();
            foreach ($calendars as $calendar) {
                $title = $calendar['title'];
                $img = $calendar['link'];
                $link = "/tartu/one/".$calendar['id'];
                $text = strip_tags($calendar['des']);
                $pos1 = mb_strpos($text, $asd);
                $des =  mb_substr($text, $pos1-10, 300);
                $des = str_replace($asd, "<strong style='font-weight: 700;'>$asd</strong>", $des);
                $des = "... ".$des." ...";
                $results[] = array("title"=>$title,'link'=>$link,'des'=>$des);
            }


            $count = count($results);

            return $this->render('search', ['results' => $results,'asd'=>$asd,'count'=>$count]);
        }else{
            return $this->render('search', ['results' => array(),'asd'=>'','count'=>0]);
        }
    }
}
