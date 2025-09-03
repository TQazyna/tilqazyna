<?php

use yii\helpers\Html;
use yii\grid\GridView;

/* @var $this yii\web\View */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Новости';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="articles-index">

    <p>
        <?php echo Html::a('Добавить новости', ['create'], ['class' => 'btn btn-success']) ?>
    </p>

    <?php echo GridView::widget([
        'dataProvider' => $dataProvider,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            //'id',
            'title:ntext',
            //'preview:ntext',
            //'text:ntext',
            //'img',
            // 'cat_id',
            // 'online',
            // 'onblock',
            // 'onslider',
            // 'date',
            // 'author',
            //'views',
            // 'comments',
            // 'conc',

            ['class' => 'yii\grid\ActionColumn'],
        ],
    ]); ?>

</div>
