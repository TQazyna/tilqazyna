<?

namespace frontend\widgets;

use yii\bootstrap\Widget;
use Yii;
class Comments extends  Widget{


    public function run(){

        $model = new \common\models\Comments();
        if($model->load(\Yii::$app->request->post()) and $model->save()){
            Yii::$app->session->setFlash('success', 'Ваш комментарий принят.');
        }
        $content_type = Yii::$app->controller->id;
        $content_id = Yii::$app->controller->actionParams['id'];

        $comments = \common\models\Comments::find()->where(["content_type"=>$content_type])->andWhere(["content_id"=>$content_id])->andWhere(["moder"=>1])->orderBy("id desc")->all();

        return $this->render("comments",["model"=>$model,'comments'=>$comments]);
    }
}