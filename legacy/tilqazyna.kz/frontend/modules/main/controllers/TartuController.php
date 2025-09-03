<?php

namespace app\modules\main\controllers;

use common\models\Articles;
use common\models\Books;
use common\models\BooksCat;
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
use frontend\components\Common;

class TartuController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex($id = null)
    {
        if(empty($id)){
			$books = Books::find()->where(['cat_id'=>2])->andWhere(["online"=>1])->orderBy("sort desc")->all();
            $title = "Кітапхана";
        }else{
            $books = Books::find()->where(['cat_id'=>$id])->andWhere(["online"=>1])->orderBy("sort desc")->all();
            $title = BooksCat::findOne($id)['title'];
        }

        $cats = BooksCat::find()->all();
        return $this->render('index',['books'=>$books,'cats'=>$cats,'title'=>$title]);
    }
    public function actionOne($id)
    {
        $book = Books::findOne($id);
        $mores = Books::find()->where(['not in','id',$id])->andWhere(['cat_id'=>$book['cat_id']])->andWhere(['online'=>1])->limit(4)->all();
        return $this->render('one',['book'=>$book,'mores'=>$mores]);
    }
    public function actionRead()
    {
        return $this->render('book');
    }

}
