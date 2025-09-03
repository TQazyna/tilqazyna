<?php

namespace app\modules\main\controllers;

use common\models\Articles;
use yii\web\Controller;
use yii\web\UrlManager;
use yii;

class AjaxController extends Controller {
	public function actionIndex()
	{
		echo 'index';
	}
	
	public function actionRate()
	{
		$id = Yii::$app->request->post('id');
		$rate = Yii::$app->request->post('rate');
		$article = Articles::find()->where(['id'=>$id])->one();
		//print_r($article);
		echo $article->rating = ($article->votes * $article->rating + $rate) / ++$article->votes;
		$article->save();
		
	}
}