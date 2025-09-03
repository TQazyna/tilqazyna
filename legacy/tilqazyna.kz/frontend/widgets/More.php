<?php

namespace frontend\widgets;

use common\models\Articles;
use common\models\Category;
use yii\bootstrap\Widget;

class More extends  Widget{



    public function run(){

		$time = time() - 30 * 24 * 60 * 60;
        $arts = Articles::find()
			//->where(['>', 'orders', $time])
			->orderBy("views desc")->limit(5)->all();
        return $this->render("more",['arts'=>$arts]);
    }
}