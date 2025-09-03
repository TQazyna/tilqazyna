<?php

use yii\helpers\Html;
use yii\grid\GridView;

/* @var $this yii\web\View */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Пользователи';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="user-index">
    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],
            'email',
            // 'status',
            // 'created_at',
            // 'updated_at',
            // 'lastname',
            // 'company',
             'username',
            'lastname',
            // 'posts',

            ['class' => 'yii\grid\ActionColumn','template'=>'{update}'],
        ],
    ]); ?>

</div>
