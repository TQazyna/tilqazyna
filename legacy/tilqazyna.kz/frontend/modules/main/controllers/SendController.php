<?php

namespace app\modules\main\controllers;

use common\models\Contact;
use yii\base\Response;
use yii\helpers\Url;
use yii\web\Controller;
use yii\web\UrlManager;
use yii\widgets\ActiveForm;
use frontend\components\Common;
use yii\data\ActiveDataProvider;
use Yii;



class SendController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex()
    {
        $art = Contact::find()->where(['status' => '1'])->orderBy("id desc")->all();
        // return $this->render('index',['art'=>$art, 'tilalemi'=>$tilalemi, 'body' => $body]);
        $model = new Contact();
        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            
            Yii::$app->session->setFlash('contactFormSubmitted');
            
            return $this->render('success', ['model' => $model, 'art'=> $art]);
        } 
        else {
            return $this->render('index', ['model' => $model, 'art'=> $art]);
        }
    }

    public function actionSuccess()
    {
        return $this->render('success');
    }

    public function actionError()
    {
        return $this->render('error');
    }

}
