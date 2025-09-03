<?php

namespace app\modules\main\controllers;

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

class StructureController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex()
    {
        return $this->render('index');
    }

    public function actionDirectors()
    {
        return $this->render('directors');
    }

    public function actionAtkdirector()
    {
        return $this->render('atkdirector');
    }

    public function actionCorpsecretary()
    {
        return $this->render('corpsecretary');
    }
    public function actionAudit()
    {
        return $this->render('audit');
    }
    public function actionBoardofdirectors()
    {
        return $this->render('boardofdirectors');
    }
    public function actionCeo()
    {
        return $this->render('ceo');
    }
    public function actionSecretary()
    {
        return $this->render('secretary');
    }
    public function actionDeputydirectory()
    {
        return $this->render('deputydirectory');
    }
    public function actionSpellingdep()
    {
        return $this->render('spellingdep');
    }
    public function actionMethodologydep()
    {
        return $this->render('methodologydep');
    }
    public function actionTerminologydep()
    {
        return $this->render('terminologydep');
    }
    public function actionItechnologydep()
    {
        return $this->render('itechnologydep');
    }
    public function actionEditorialdep()
    {
        return $this->render('editorialdep');
    }
    public function actionLawdep()
    {
        return $this->render('lawdep');
    }
    public function actionFindep()
    {
        return $this->render('findep');
    }
       


    
}
