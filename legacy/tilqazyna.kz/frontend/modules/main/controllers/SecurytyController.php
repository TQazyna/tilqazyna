<?php

namespace app\modules\main\controllers;

use common\models\Contact;
use yii\helpers\Url;
use yii\web\Controller;
use yii\web\UrlManager;
use yii\widgets\ActiveForm;
use frontend\components\Common;
use Yii;

class SecurityController extends Controller
{
    public $layout = "bootstrap";

    public function actionTilqural()
    {
       return $this->render('tilqural');
    }
}
