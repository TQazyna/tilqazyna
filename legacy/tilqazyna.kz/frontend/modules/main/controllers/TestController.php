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

class TestController extends Controller
{
    public $layout = "bootstrap";
    //public $layout = "none";

    public function actionIndex()
    {
        $sliders = Articles::find()->where(["onslider"=>1])->orderBy("id asc")->limit(3)->all();
        $blogs = Articles::find()->where(['cat_id'=>14])->andWhere(['online'=>1])->orderBy("id desc")->limit(4)->all();
        $articles = Articles::find()->where(['cat_id'=>11])->andWhere(['online'=>1])->orderBy("orders desc")->limit(2)->all();
        $news = Articles::find()->where(['cat_id'=>11])->andWhere(['online'=>1])->orderBy("id desc")->limit(3)->all();
        //$articles2 = Articles::find()->where(['cat_id'=>17])->andWhere(['online'=>1])->orderBy("orders desc")->limit(1)->all();
        //$articles3 = Articles::find()->where(['cat_id'=>16])->andWhere(['online'=>1])->orderBy("orders desc")->limit(1)->all();
        //$articles4 = Articles::find()->where(['cat_id'=>13])->andWhere(['online'=>1])->orderBy("orders desc")->limit(3)->all();
        //$articles = array_merge($articles1,$articles2,$articles3,$articles4);
        $users = User::find()->where(['not in','id',9])->limit(5)->all();
        /*$books = [];
        $books[0] = Books::findOne(63);
        $books[1] = Books::findOne(60);
        $books[2] = Books::findOne(96);
        $books[3] = Books::findOne(76);
        $books[4] = Books::findOne(62);*/
        $books = Books::find()->where(["id"=>441])->orWhere(["id"=>442])->orWhere(["id"=>443])->orWhere(["id"=>444])->orWhere(["id"=>445])->orderBy("title desc")->all();



        return $this->render('index',['sliders'=>$sliders,'articles'=>$articles,'blogs'=>$blogs,'users'=>$users,'books'=>$books,'news'=>$news]);
    }

    public function actionTest()
    {
        $sliders = Articles::find()->where(["onslider"=>1])->orderBy("id asc")->limit(3)->all();
        $blogs = Articles::find()->where(['cat_id'=>14])->andWhere(['online'=>1])->orderBy("id desc")->limit(4)->all();
        $articles = Articles::find()->where(['cat_id'=>11])->andWhere(['online'=>1])->orderBy("orders desc")->limit(2)->all();
        $news = Articles::find()->where(['cat_id'=>11])->andWhere(['online'=>1])->orderBy("id desc")->limit(3)->all();
        //$articles2 = Articles::find()->where(['cat_id'=>17])->andWhere(['online'=>1])->orderBy("orders desc")->limit(1)->all();
        //$articles3 = Articles::find()->where(['cat_id'=>16])->andWhere(['online'=>1])->orderBy("orders desc")->limit(1)->all();
        //$articles4 = Articles::find()->where(['cat_id'=>13])->andWhere(['online'=>1])->orderBy("orders desc")->limit(3)->all();
        //$articles = array_merge($articles1,$articles2,$articles3,$articles4);
        $users = User::find()->where(['not in','id',9])->limit(5)->all();
        /*$books = [];
        $books[0] = Books::findOne(63);
        $books[1] = Books::findOne(60);
        $books[2] = Books::findOne(96);
        $books[3] = Books::findOne(76);
        $books[4] = Books::findOne(62);*/
        $books = Books::find()->where(["id"=>441])->orWhere(["id"=>442])->orWhere(["id"=>443])->orWhere(["id"=>444])->orWhere(["id"=>445])->orderBy("title desc")->all();



        return $this->render('index',['sliders'=>$sliders,'articles'=>$articles,'blogs'=>$blogs,'users'=>$users,'books'=>$books,'news'=>$news]);
    }
    public function actionLogout()
    {
        \Yii::$app->user->logout();
        return $this->goHome();
    }

    public function actionEvent()
    {
        $component = new Common();
        $component->on(Common::EVENT_NOTIFY,[$component,'notifyAdmin']);
        $component->sendMail("admin@masd.ru","asd","asd","asd");
    }
    
    public function actionForum()
    {
        return $this->render('forum');
    }
}
