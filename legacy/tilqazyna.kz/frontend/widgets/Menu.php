<?

namespace frontend\widgets;

use common\models\Category;
use yii\bootstrap\Widget;

class Menu extends  Widget{


    public function run(){
        $cats = Category::find()->all();


        return $this->render("menu",['cats'=>$cats]);
    }
}