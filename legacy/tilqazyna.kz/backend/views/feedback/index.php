<?php

use yii\helpers\Html;
use yii\grid\GridView;

/* @var $this yii\web\View */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Заявки';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="feedback-index">
    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],
            'name',
            'email:email',
            'message',
            'answer',
            'status',
            [
                'attribute' => 'dtime',
                'format' => ['date', 'php:d.m.Y -  H:i']
            ],       

            ['class' => 'yii\grid\ActionColumn'],
        ],
    ]); ?>

</div>
