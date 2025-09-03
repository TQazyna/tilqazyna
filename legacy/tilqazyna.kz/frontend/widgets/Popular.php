<?php

namespace frontend\widgets;

use common\models\Articles;
use common\models\Category;
use yii\bootstrap\Widget;

class Popular extends  Widget{



    public function run(){
		$time = time() - 30 * 24 * 60 * 60;
        $arts = Articles::find()
			//->where(['>', 'orders', $time])->orderBy("views desc")
			->orderBy("id desc")
			->where(["cat_id"=>13])->limit(4)->all();

        return $this->render("popular",['arts'=>$arts]);
    }
}