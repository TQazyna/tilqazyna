<?php

use yii\helpers\Html;
use yii\widgets\DetailView;

/* @var $this yii\web\View */
/* @var $model common\models\Banners */

$this->title = $model->title;
$this->params['breadcrumbs'][] = ['label' => 'Баннера', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="banners-view">


    <?= DetailView::widget([
        'model' => $model,
        'attributes' => [
            'title',
            'img',
            'pos',
            'link',
            'type',
        ],
    ]) ?>

</div>
