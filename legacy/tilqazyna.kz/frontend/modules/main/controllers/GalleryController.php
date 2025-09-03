<?php

namespace app\modules\main\controllers;

use common\models\User;
use common\models\Gallery;
use frontend\models\SignupForm;
use frontend\models\ContactForm;
use common\models\LoginForm;
use yii\base\Response;
use yii\helpers\Url;
use yii\web\Controller;
use yii\web\UrlManager;
use yii\widgets\ActiveForm;
use frontend\components\Common;

class GalleryController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex()
    {
        $gallery = Gallery::find()->where(['online'=>1])->orderBy("id desc")->all();
        return $this->render('index',['gallery'=>$gallery]);
    }
}
