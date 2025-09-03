<?php

namespace app\modules\main\controllers;

use common\models\Adis;
use common\models\Category;
use common\models\User;
use common\models\VideoCats;
use frontend\models\SignupForm;
use frontend\models\ContactForm;
use common\models\LoginForm;
use yii\base\Response;
use yii\helpers\Url;
use yii\web\Controller;
use yii\web\UrlManager;
use yii\widgets\ActiveForm;
use frontend\components\Common;

class AdisController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex($cat=null,$id=null)
    {
        $art = Adis::find()->orderBy("id desc")->all();
        return $this->render('index',['art'=>$art]);
      

    }

}
