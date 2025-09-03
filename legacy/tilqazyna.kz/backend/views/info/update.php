<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model common\models\Info */

$this->title = 'Изменить страницу: ' . ' ' . $model->title;
$this->params['breadcrumbs'][] = ['label' => 'Страницы', 'url' => ['index']];
$this->params['breadcrumbs'][] = ['label' => $model->title, 'url' => ['view', 'id' => $model->id]];
$this->params['breadcrumbs'][] = 'Изменить';
?>
<div class="info-update">

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
