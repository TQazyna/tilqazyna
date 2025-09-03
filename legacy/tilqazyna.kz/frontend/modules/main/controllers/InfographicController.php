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

class InfographicController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex($id=null)
    {
        $art = Info::find()->where(['alias'=>$id])->one();
        return $this->render('index',['art'=>$art]);
    }

    public function actionSozdikqor()
    {
        return $this->render('sozdikqor');
    }
    public function actionQazlatyn()
    {
        return $this->render('qazlatyn');
    }
    public function actionTilalemi()
    {
        return $this->render('tilalemi');
    }
    public function actionTermincom()
    {
        return $this->render('termincom');
    }
    

}
