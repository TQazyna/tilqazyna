<?

namespace frontend\widgets;

use common\models\Articles;
use common\models\Category;
use yii\bootstrap\Widget;

class SliderMainPage extends  Widget{

	public $limit;
	public $template;

	public function init(){
		parent::init();
		if ($this->limit == null){
			$this->limit = 5;
		}
		if ($this->template == null){
			$this->template = 'sliderMainPage';
		}
	}
	
    public function run(){
        $slides = Articles::find()->where(["onslider"=>1])
			->orderBy("id desc")->limit((int)$this->limit)->all();
		if (isset($_GET['t']))
			return $this->render('sliderMainPage_v4',['slides'=>$slides]);
		else if (isset($_GET['t3']))
			return $this->render('sliderMainPage_v3',['slides'=>$slides]);
		else return $this->render('sliderMainPage_v3',['slides'=>$slides]);
    }
}