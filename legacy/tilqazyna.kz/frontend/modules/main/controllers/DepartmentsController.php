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

class DepartmentsController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex()
    {
        $art = Articles::find()->orderBy("id desc")->all();
        return $this->render('index',['art'=>$art]);
    }
}
