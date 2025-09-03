<?php

namespace app\modules\main\controllers;

use common\models\Articles;
use common\models\Ortalyk;
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

class NewortaController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex($cat=null,$id=null)
    {
		$categories = Category::find()->where(['pid'=>30])->all();
        if(empty($cat)){
            $baykau = Articles::find()->where(['cat_id'=>31])->orderBy("id desc")->limit(6)->all();
            $is_shara = Articles::find()->where(['cat_id'=>32])->orderBy("id desc")->limit(6)->all();
            $seminar = Articles::find()->where(['cat_id'=>33])->orderBy("id desc")->limit(6)->all();
			$course = Articles::find()->where(['cat_id'=>34])->orderBy("id desc")->limit(6)->all();
			$ortalyks = Ortalyk::find()->orderBy("id desc")->all();
            $title = "Орта";
            return $this->render('index',['baykau'=>$baykau,'is_shara'=>$is_shara,'seminar'=>$seminar,'course'=>$course,'ortalyks'=>$ortalyks,'cat'=>$cat,'title'=>$title, 'categories'=>$categories]);
        }elseif(strlen($cat) > 0){
			$cats = array(
            31 => array(
				1 => 'Тіл парасат',
				'Мемлекеттік тіл және БАҚ',
				'«Тілдарын» олимпиада',
				'Текті сөздің төресі – терме',
				'Тіл шебері',
				'Абай атындағы көркемсөз оқу шеберлерінің байқауы',
				'Мемлекеттік тіл – мемлекеттік қызметте',
				'КТК (КВН) ойыны',
				'Үздік қызметкер',
			),
            array(
				1 => 'Славян жазбалары күндері ',
				'Дүниежүзі қазақтарының құрылтайы',
				'Қазақстанның болашағы – қазақ тілінде ',
				'«Тіл бұзуға тосқауыл» акция',
				'Көшпелі дәрістер',
			),
            array(
				1 => 'Терминологияның өзекті мәселелері',
				'Республикалық конференция ',
				'Ономастика мәселесі бойынша өңірлік семинар ',
				'Түркі жазбалары мен мәдениеті күндері',
				'Республикалық онлайн семинар',
				'БАҚ және тіл мәдениет'
			),
            array(
				1 => 'Ілеспе аударма жүргізу',
				'Қазақ және ана тілдерін оқыту',
				'Үш тілділікті ілгерілету',
			)
			);
			$category = Category::find()->where(['alias'=>$cat])->one();
			$articles = Articles::find()->where(['cat_id'=>$category->id]);
			if ($id > 0)
			{
				$articles->where(['subcat_id'=>$id]);
			}
			$articles = $articles->orderBy("id desc")->all();
            return $this->render('adis',['articles'=>$articles,'cat'=>$cat,'title'=>$category->title, 'categories'=>$categories, 'cats'=>$cats[$category->id], 'selected'=>$id]);
		}
		
    }

}
