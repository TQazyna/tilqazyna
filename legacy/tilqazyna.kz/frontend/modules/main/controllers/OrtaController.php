<?php

namespace app\modules\main\controllers;

use common\models\Articles;
use common\models\Category;
use common\models\User;
use common\models\VideoCats;
use frontend\models\SignupForm;
use frontend\models\ContactForm;
use common\models\LoginForm;
use yii\base\Response;
use yii\helpers\Url;
use yii\web\Controller;
use yii\web\UrlManager;
use yii\widgets\ActiveForm;
use frontend\components\Common;

class OrtaController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex($cat=null,$id=null)
    {
        if(empty($cat)){
            $news = Articles::find()->where(['cat_id'=>41])->orWhere(["cat_id"=>41])->orderBy("id desc")->limit(5)->all();
            $videos = Articles::find()->where(['video_cats'=>1])->orderBy("id desc")->limit(9)->all();
            $audios = Articles::find()->where(['cat_id'=>18])->orderBy("id desc")->limit(11)->all();
            $title = "Жаңа";
            return $this->render('index',['articles'=>$news,'videos'=>$videos,'audios'=>$audios,'cat'=>$cat,'title'=>$title]);
        }elseif($cat == 'kenes'){
            $news = Articles::find()->where(['cat_id'=>16])->orderBy("id desc")->all();
            $title = "Ғалымнан кеңес";
            return $this->render('adis',['articles'=>$news,'cat'=>$cat,'title'=>$title]);
        }elseif($cat == 'komek'){
            $news = Articles::find()->where(['cat_id'=>17])->orderBy("id desc")->all();
            $title = "Әдіскерге көмек";
            return $this->render('adis',['articles'=>$news,'cat'=>$cat,'title'=>$title]);
        }elseif($cat == 'videos'){

            $videos = Articles::find()->where(['cat_id'=>15])->orderBy("id desc")->all();
            $title = "Видеосабақтар";
            if(!empty($id)){
                $title = VideoCats::findOne($id)['title'];
                $videos = Articles::find()->where(['cat_id'=>15])->andWhere(['video_cats'=>$id])->orderBy("id desc")->all();
            }

            return $this->render('videos',['videos'=>$videos,'ids'=>$id,'cat'=>$cat,'title'=>$title]);
        }elseif($cat == 'audios'){
            $audios = Articles::find()->where(['cat_id'=>18])->orderBy("id desc")->all();
            $title = "Аудиосабақтар";
            return $this->render('audios',['audios'=>$audios,'cat'=>$cat,'title'=>$title]);
        }




    }

}
