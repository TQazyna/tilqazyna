<?php

use yii\helpers\Html;


/* @var $this yii\web\View */
/* @var $model common\models\Info */

$this->title = 'Добавить страницу';
$this->params['breadcrumbs'][] = ['label' => 'Страницы', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="info-create">
    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
