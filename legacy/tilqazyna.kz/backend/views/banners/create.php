<?php

use yii\helpers\Html;


/* @var $this yii\web\View */
/* @var $model common\models\Banners */

$this->title = 'Добавить баннер';
$this->params['breadcrumbs'][] = ['label' => 'Баннера', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="banners-create">
    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
