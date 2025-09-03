<?php

namespace app\modules\main\controllers;

use common\models\Articles;
use common\models\Books;
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
use Yii;
use yii\web\UploadedFile;

class UsersController extends Controller
{
    public $layout = "bootstrap";


    public function actionIndex($id = null)
    {
        $user = User::findOne($id);
        if(!empty($user)){

            $others = User::find()->where(['not in','id',9])->limit(8)->orderBy("id asc")->all();
            $blogs = Articles::find()->where(["cat_id"=>14])->andWhere(['author_link'=>$user['id']])->orderBy("id desc")->all();
            $books = Books::find()->where(['author_link'=>$user['id']])->orderBy("id desc")->all();
            $audios = Articles::find()->where(["cat_id"=>18])->andWhere(['author_link'=>$user['id']])->orderBy("id desc")->all();
            $videos = Articles::find()->where(["cat_id"=>15])->andWhere(['author_link'=>$user['id']])->orderBy("id desc")->all();
            $komeks = Articles::find()->where(["cat_id"=>17])->andWhere(['author_link'=>$user['id']])->orderBy("id desc")->all();
            $keneses = Articles::find()->where(["cat_id"=>16])->andWhere(['author_link'=>$user['id']])->orderBy("id desc")->all();

            $news = Articles::find()->where(["not in",'author_link',$user['id']])->andWhere((["not in",'author_link',9]))->andWhere(["not in",'cat_id',11])->orderBy("id desc")->limit(7)->all();

            return $this->render('index',['user'=>$user,'others'=>$others,'blogs'=>$blogs,'books'=>$books,'audios'=>$audios,'videos'=>$videos,'komeks'=>$komeks,'keneses'=>$keneses,'news'=>$news]);
        }
        if(empty($id)){
            throw new \yii\web\HttpException(404, 'The requested Item could not be found.');
        }

    }
    public function actionEdit()
    {
        $user = \Yii::$app->user->identity;
        if(!empty($user)){
            if(Yii::$app->request->post()){
                $post = Yii::$app->request->post();
                $model = User::findOne($user['id']);


                $file = UploadedFile::getInstancesByName('avatar');
                if(!empty($file)){
                        $file = array_shift($file);

                        if ($file) {
                            $rand = rand(900000,9000000);

                            $dir = Yii::getAlias('@frontend/web/img/users/');
                            $dir2 = Yii::getAlias('img/users/');
                            $fileName = $rand . '.' . $file->extension;
                            $file->saveAs($dir . $fileName);
                            $file = $fileName; // без этого ошибка
                            $model->avatar = '/'.$dir2 . $fileName;
                        }
                    }


                $file2 = UploadedFile::getInstancesByName('background');
                if(!empty($file2)){
                        $file = array_shift($file2);

                        if ($file) {
                            $rand = rand(900000,9000000);

                            $dir = Yii::getAlias('@frontend/web/img/users/');
                            $dir2 = Yii::getAlias('img/users/');
                            $fileName = $rand . '.' . $file->extension;
                            $file->saveAs($dir . $fileName);
                            $file = $fileName; // без этого ошибка
                            $model->background = '/'.$dir2 . $fileName;
                        }
                    }
                if(!empty($post['username'])){
                    $model->username = trim(strip_tags($post['username']));
                }
                if(!empty($post['lastname'])){
                    $model->lastname = trim(strip_tags($post['lastname']));
                }
                if(!empty($post['city'])){
                    $model->city = trim(strip_tags($post['city']));
                }
                if(!empty($post['birthday'])){
                    $model->birthday = $post['birthday'];
                }
                if(!empty($post['password'])){
                    $model->setPassword(trim(strip_tags($post['password'])));
                }


                $model->save();


                $session = Yii::$app->session;
                $session->setFlash('successAnswer', 'Өзгертулер сақталды');
                $this->redirect($_SERVER['HTTP_REFERER']);
            }
            return $this->render('edit',['user'=>$user]);
        }
        if(empty($request)){
            throw new \yii\web\HttpException(404, 'The requested Item could not be found.');
        }

    }
    public function actionCreate()
    {
        $user = \Yii::$app->user->identity;
        if(!empty($user)){
            if(Yii::$app->request->post()){
                $post = Yii::$app->request->post();
                $model = User::findOne($user['id']);


                $file = UploadedFile::getInstancesByName('avatar');
                if(!empty($file)){
                    $file = array_shift($file);

                    if ($file) {
                        $rand = rand(900000,9000000);

                        $dir = Yii::getAlias('@frontend/web/img/users/');
                        $dir2 = Yii::getAlias('img/users/');
                        $fileName = $rand . '.' . $file->extension;
                        $file->saveAs($dir . $fileName);
                        $file = $fileName; // без этого ошибка
                        $model->avatar = '/'.$dir2 . $fileName;
                    }
                }


                $file2 = UploadedFile::getInstancesByName('background');
                if(!empty($file2)){
                    $file = array_shift($file2);

                    if ($file) {
                        $rand = rand(900000,9000000);

                        $dir = Yii::getAlias('@frontend/web/img/users/');
                        $dir2 = Yii::getAlias('img/users/');
                        $fileName = $rand . '.' . $file->extension;
                        $file->saveAs($dir . $fileName);
                        $file = $fileName; // без этого ошибка
                        $model->background = '/'.$dir2 . $fileName;
                    }
                }
                if(!empty($post['username'])){
                    $model->username = trim(strip_tags($post['username']));
                }
                if(!empty($post['lastname'])){
                    $model->lastname = trim(strip_tags($post['lastname']));
                }
                if(!empty($post['city'])){
                    $model->city = trim(strip_tags($post['city']));
                }
                if(!empty($post['birthday'])){
                    $model->birthday = $post['birthday'];
                }
                if(!empty($post['password'])){
                    $model->setPassword(trim(strip_tags($post['password'])));
                }


                $model->save();


                $session = Yii::$app->session;
                $session->setFlash('successAnswer', 'Өзгертулер сақталды');
                $this->redirect($_SERVER['HTTP_REFERER']);
            }
            return $this->render('create',['user'=>$user]);
        }
        if(empty($request)){
            throw new \yii\web\HttpException(404, 'The requested Item could not be found.');
        }

    }
}
