<?php

namespace frontend\widgets;

use common\models\Articles;
use common\models\Category;
use common\models\Members;
use yii\bootstrap\Widget;

class Words extends  Widget{
    public function run(){

        $words = \common\models\Words::find()->all();
        return $this->render("words",['words'=>$words]);
    }
}