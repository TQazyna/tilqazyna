<?php

use yii\helpers\Html;
use yii\grid\GridView;

/* @var $this yii\web\View */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Страница';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="articles-index">

    <p>
        <?php echo Html::a('Добавить статью', ['create'], ['class' => 'btn btn-success']) ?>
    </p>

    <?php echo GridView::widget([
        'dataProvider' => $dataProvider,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            //'id',
            'title:ntext',
            //'text:ntext',


            ['class' => 'yii\grid\ActionColumn'],
        ],
    ]); ?>

</div>
