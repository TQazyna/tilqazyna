<?php

namespace app\modules\main\controllers;

use common\models\Articles;
use common\models\Category;
use common\models\User;
use common\models\UzdikCat;
use common\models\Uzdik; 
use frontend\models\SignupForm;
use frontend\models\ContactForm;
use common\models\LoginForm;
use yii\base\Response;
use yii\helpers\Url;
use yii\web\Controller;
use yii\web\UrlManager;
use yii\widgets\ActiveForm;
use frontend\components\Common;

class ProgramController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex($id=null)
    {
		    if(empty($id)){
			$news = Articles::find()->where(['cat_id'=>25])->orwhere(['cat_id'=>26])->orwhere(['cat_id'=>27])->orwhere(['cat_id'=>28])->orwhere(['cat_id'=>29])->orwhere(['cat_id'=>30])->andWhere(['online'=>1])->orderBy("orders desc")->all();
            }else{
			$news = Articles::find()->where(['cat_id'=>$id])->andWhere(['online'=>1])->orderBy("orders desc")->all();

            }
		$uzdik = Uzdikcat::find()->all();
        return $this->render('index',['arts'=>$news,'uzdiks'=>$uzdik]);
    }
 
}
