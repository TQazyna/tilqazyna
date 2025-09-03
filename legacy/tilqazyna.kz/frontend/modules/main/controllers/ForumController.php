<?php

namespace app\modules\main\controllers;
use common\models\Articles;
use common\models\Books;
use common\models\User;
use frontend\models\SignupForm;
use frontend\models\ContactForm;
use common\models\LoginForm;
use yii\base\Response;
use yii\helpers\Url;
use yii\web\Controller;
use yii\widgets\ActiveForm;
use frontend\components\Common;


class ForumController extends Controller
{
    public function actionIndex()
    {
        return $this->render('index');
    }


    public function actionForum()
    {
        return $this->render('forum');
    }
}
