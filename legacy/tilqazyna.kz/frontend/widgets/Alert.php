<?php 

namespace frontend\widgets;

use common\models\Articles;
use common\models\Category;
use common\models\Members;
use yii\bootstrap\Widget;

use Yii;
use yii\bootstrap\Alert as BootstrapAlert;

class Alert extends Widget
{
    public function init()
    {
        parent::init();

        $session = Yii::$app->session;
        $flashes = $session->getAllFlashes();

        foreach ($flashes as $type => $flash) {
            foreach ((array) $flash as $i => $message) {
                echo BootstrapAlert::widget([
                    'body' => $message,
                    'options' => ['class' => 'alert-' . $type],
                ]);
            }
            $session->removeFlash($type);
        }
    }
}
?>