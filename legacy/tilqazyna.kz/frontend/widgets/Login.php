<?php

namespace frontend\widgets;

use common\models\Articles;
use common\models\Category;
use common\models\LoginForm;
use frontend\models\SignupForm;
use yii\bootstrap\Widget;
use yii\helpers\Url;
use yii\web\Response;
use yii\widgets\ActiveForm;
use Yii;
class Login extends  Widget{


    public function run(){

        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            return true;
        }
        return $this->render('login', [
            'model' => $model,
        ]);
    }
}