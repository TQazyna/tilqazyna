<?php

namespace app\modules\main\controllers;

use common\models\Lessons;
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

class LessonsController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex($id=null)
    {
        $news = Lessons::find()->where(['cat_id'=>11])->andWhere(['online'=>1])->orderBy("orders desc")->all();
        return $this->render('index',['arts'=>$news]);
    }

}
