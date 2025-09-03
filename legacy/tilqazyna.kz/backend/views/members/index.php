<?php

use yii\helpers\Html;
use yii\grid\GridView;

/* @var $this yii\web\View */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Участники конкурса';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="members-index">

    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            'name',
            'email:email',
            'city',
            'moder',
            // 'img1',
            // 'img2',
            // 'img3',
            // 'img4',
            // 'img5',
            // 'voices',

            ['class' => 'yii\grid\ActionColumn','template'=>'{view}  {delete}{moder}',
                'buttons' => [
                    'moder' => function ($url,$model,$key) {
                        return Html::a('опубликовать', $url);
                    },
                ],
            ],
        ],
    ]); ?>

</div>
