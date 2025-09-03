<?

namespace frontend\widgets;

use common\models\Articles;
use common\models\Category;
use common\models\Members;
use yii\bootstrap\Widget;

class Articles1 extends  Widget{
    public function run(){
        $arts1 = Articles::find()->orderBy("id desc")->where(['not in','conc',1])->limit(6)->all();
        $arts2 =  \Yii::$app->db->createCommand('SELECT * FROM articles LIMIT 6, 9')->queryAll();
        $membres = Members::find()->orderBy("voices desc")->limit(4)->all();
        return $this->render("articles1",['arts'=>$arts1,'arts2'=>$arts2,'members'=>$membres]);
    }
}