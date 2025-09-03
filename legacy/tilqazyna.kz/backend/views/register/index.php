<?php

use yii\helpers\Html;
use yii\grid\GridView;

/* @var $this yii\web\View */
/* @var $searchModel app\models\searchRegister */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Тіркелген құжаттар';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="register-index">


    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        // 'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            'id',
            'article:ntext',
            'fio:ntext',
            'position',
            //'tel',
            'email:email',
            // 'cert',
            // 'file',

            [
                'attribute' => 'file',
                'format' => 'raw',
                'value' => function ($data) {
                    return
                        Html::a('Жіберілген құжат', [$data->file], ['class' => 'btn btn-primary']);
                }
            ],

            [
                'class' => 'yii\grid\ActionColumn',
                'template' => '',
            ],
        ],
    ]); ?>
</div>
<style>
    .glyphicon-trash {
        display: none;
    }
</style>