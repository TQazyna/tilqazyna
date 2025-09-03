<?php

namespace app\modules\main\controllers;

use common\models\Articles;
use common\models\Tilalemi;
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

use GuzzleHttp\Client; // подключаем Guzzle

class AnnouncementsController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex($cat=null,$id=null)
    {
        // $client = new Client();
        // // отправляем запрос к странице Яндекса
        // $res = $client->request('GET', 'http://www.yandex.ru');
        // // получаем данные между открывающим и закрывающим тегами body
        // $body = $res->getBody();
        // // вывод страницы Яндекса в представление

        $query = Articles::find()
            ->where('online = 1')
            ->where('text != ""')
            ->where('cat_id = 35')
            ->orderBy("id desc");

        $count = $query->count();

        $pagination = new \yii\data\Pagination([
            'defaultPageSize' => 9,
            'totalCount' => $count,
        ]);

        $art = $query->offset($pagination->offset)
            ->limit($pagination->limit)
            ->all();

        // \yii\helpers\VarDumper::dump(Category::find()->all(), 10, true);

        return $this->render('index',['art'=>$art, 'pagination' => $pagination]);
        // return $this->render('index');
    }

}
