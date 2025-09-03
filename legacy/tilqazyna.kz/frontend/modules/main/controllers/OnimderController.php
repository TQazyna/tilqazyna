<?php

namespace app\modules\main\controllers;

use common\models\Articles;
use common\models\Category;
use common\models\Ortalyk;
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

class OnimderController extends Controller
{
    public $layout = "bootstrap";

    public function actionAtau()
    {
        return $this->render('atau');
    }
    public function actionTilalemi()
    {
        return $this->render('tilalemi');
    }
    public function actionQazlatyn()
    {
        return $this->render('qazlatyn');
    }
    public function actionEmle()
    {
        return $this->render('emle');
    }
    public function actionSozdikqor()
    {
        return $this->render('sozdikqor');
    }
    public function actionBalatili()
    {
        return $this->render('balatili');
    }
    public function actionTilmedia()
    {
        return $this->render('tilmedia');
    }
    public function actionTermincom()
    {
        return $this->render('termincom');
    }
    public function actionQujat()
    {
        return $this->render('qujat');
    }


}
