<?php

namespace app\modules\main\controllers;

use common\models\Articles;
use common\models\Category;
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

class TolganysController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex($date=null)
    {
        if(!$date){
            $blogs = Articles::find()->where(['cat_id'=>14])->andWhere(['online'=>1])->orderBy("id desc")->all();
        }elseif($date == "day"){
            $blogs = Articles::find()->where(['cat_id'=>14])->andWhere(['online'=>1])->andWhere(['date'=>date('d.m.Y')])->orderBy("id desc")->all();

        }elseif($date == "week"){
            $blogs = Articles::find()->where(['cat_id'=>14])->andWhere(['online'=>1])->orderBy("id desc")->all();
        }elseif($date == "month"){
            $blogs = Articles::find()->where(['cat_id'=>14])->andWhere(['online'=>1])->orderBy("id desc")->all();
        }

        return $this->render('index',['blogs'=>$blogs,'page'=>$date]);
    }

}
