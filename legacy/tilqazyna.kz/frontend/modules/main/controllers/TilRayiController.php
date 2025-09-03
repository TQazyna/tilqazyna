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

class TilRayiController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex($id=null)
    {
        $news = Articles::find()->where(['cat_id'=>13])->orderBy("id desc")->all();
        return $this->render('index',['arts'=>$news]);
    }

}
