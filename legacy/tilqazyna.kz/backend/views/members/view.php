<?php

use yii\helpers\Html;
use yii\widgets\DetailView;

/* @var $this yii\web\View */
/* @var $model common\models\Members */

$this->title = $model->name;
$this->params['breadcrumbs'][] = ['label' => 'Участники', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="members-view">
    <?= DetailView::widget([
        'model' => $model,
        'attributes' => [
            'id',
            'name',
            'email:email',
            'city',
            'text:ntext',
            'img1',
            'img2',
            'img3',
            'img4',
            'img5',
            'voices',
        ],
    ]) ?>

</div>
