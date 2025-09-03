<?php

namespace frontend\widgets;

use common\models\Articles;
use common\models\Category;
use frontend\models\SignupForm;
use yii\bootstrap\Widget;
use yii\helpers\Url;
use yii\web\Response;
use yii\widgets\ActiveForm;
use Yii;
class Register extends  Widget{


    public function run(){
        $model = new SignupForm;

        
        if($model->load(\Yii::$app->request->post()) and $model->signup()){
            return true;
        }

        return $this->render("register",["model"=>$model]);
    }
}