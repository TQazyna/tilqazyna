<?php

namespace app\modules\main\controllers;

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

class OrtalykController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex()
    {
        $countries = Ortalyk::find()->all();
        echo $countries;
	}
	public function actionAqmola()
    {
        return $this->render('aqmola');
	}

	public function actionAqtobe()
    {
        return $this->render('aqtobe');
	}

	public function actionNursultan()
    {
        return $this->render('nursultan');
	}

	public function actionAlmaty()
    {
        return $this->render('almaty');
	}

	public function actionAlmatyobl()
    {
        return $this->render('almatyobl');
	}

	public function actionAtyrau()
    {
        return $this->render('atyrau');
	}

	public function actionBatys()
    {
        return $this->render('batys');
	}

	public function actionJambil()
    {
        return $this->render('jambil');
	}

	public function actionQaraganda()
    {
        return $this->render('qaraganda');
	}


	public function actionQostanay()
    {
        return $this->render('qostanay');
	}

	public function actionQyzylorda()
    {
        return $this->render('qyzylorda');
	}

	public function actionTurkestan()
    {
        return $this->render('turkestan');
	}

	public function actionMangystau()
    {
        return $this->render('mangystau');
	}

	public function actionPavlodar()
    {
        return $this->render('pavlodar');
	}

	public function actionSoltystik()
    {
        return $this->render('soltystik');
	}

	public function actionShygys()
    {
        return $this->render('shygys');
	}




}
