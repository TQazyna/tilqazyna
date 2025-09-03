<?

namespace frontend\widgets;

use common\models\Articles;
use common\models\Category;
use yii\bootstrap\Widget;

class Slider extends  Widget{


    public function run(){
        $arts = Articles::find()->where(["onslider"=>1])->all();

        return $this->render("slider",['arts'=>$arts]);
    }
}