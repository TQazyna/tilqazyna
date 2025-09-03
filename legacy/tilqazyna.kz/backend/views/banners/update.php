<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model common\models\Banners */

$this->title = 'Изменить баннер: ' . ' ' . $model->title;
$this->params['breadcrumbs'][] = ['label' => 'Баннера', 'url' => ['index']];
$this->params['breadcrumbs'][] = ['label' => $model->title, 'url' => ['view', 'id' => $model->id]];
$this->params['breadcrumbs'][] = 'Изменить';
?>
<div class="banners-update">

    <?php echo $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
