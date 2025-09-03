<?

namespace frontend\widgets;

use common\models\User;
use yii\bootstrap\Widget;
use yii\web\UploadedFile;
use Yii;
use yii\imagine\Image;

class Feedback extends  Widget{

    public function run(){



        $model = new \common\models\Feedback();

        if($model->load(\Yii::$app->request->post())){
            $model->save();
            \common\models\Feedback::sendEmail("bakhti.info@mail.ru",'','Новая заявка','Поступила новая заявка. Пожалуйста, откройте панель администрирования сайта, для того чтобы увидеть заявку.');
            //$model->trigger(Subscribe::EVENT_NOTIFICATION_ADMIN);
            //\Yii::$app->session->setFlash('message','Success subscribe');
            //\Yii::$app->controller->redirect("/");
            //return true;
        }

        return $this->render("feedback", ['model' => $model]);
    }
}