<?php

namespace app\modules\main\controllers;
use common\models\UzdikCat;
use common\models\Uzdik; 
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
use yii\helpers\VarDumper;
use frontend\components\Common;

class ArticleController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex($id=null)
    {
		// $uzdik = Uzdikcat::find()->all();
		
        $art = Articles::findOne($id);

        \Yii::$app->view->registerMetaTag([
            "property"=>"og:title",
            'content' => $art['title']
        ]);
        $des = substr(strip_tags($art['text']),0,255);
        \Yii::$app->view->registerMetaTag([
            "property"=>"og:description",
            'content' =>  $des
        ]);
        $url = \Yii::$app->request->hostInfo . Url::to();
        \Yii::$app->view->registerMetaTag([
            "property"=>"og:url",
            'content' =>$url
        ]);
        $img = \Yii::$app->request->hostInfo . $art['img'];
        \Yii::$app->view->registerMetaTag([
            "property"=>"og:image",
            'content' =>$img
        ]);
        \Yii::$app->view->registerMetaTag([
            "name"=>"title",
            'content' => $art['title']
        ]);
        \Yii::$app->view->registerMetaTag([
            "name"=>"description",
            'content' =>  $des
        ]);

		\Yii::$app->view->registerLinkTag(['rel' => 'image_src', 'href' => $img ]);


        // VarDumper::dump($art, 10, true);

        // $art->views++;
        // $art->save();
        // $cat = \common\models\Articles::getCatById($art['cat_id']);
        // $cat_id = $cat['id'];
        // $mores = \common\models\Articles::find()->where(['not in','id',$id])->andWhere(['cat_id'=>$cat_id])->limit(3)->orderBy("id desc")->all();
        return $this->render('index',['art'=>$art]);
    }
}
