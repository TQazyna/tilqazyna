<?php

use yii\helpers\Html;
use yii\widgets\DetailView;

/* @var $this yii\web\View */
/* @var $model common\models\Articles */

$this->title = $model->title;
$this->params['breadcrumbs'][] = ['label' => 'Жаңалықтар', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="articles-view">
    <p>
        <?php echo Html::a('Және қосу', ['create'], ['class' => 'btn btn-success']) ?>
        <?php echo Html::a('Өзгерту', ['update', 'id' => $model->id], ['class' => 'btn btn-primary']) ?>
        <?php echo Html::a('Өшіру', ['delete', 'id' => $model->id], [
            'class' => 'btn btn-danger',
            'data' => [
                'confirm' => 'Are you sure you want to delete this item?',
                'method' => 'post',
            ],
        ]) ?>
    </p>

    <?php echo DetailView::widget([
        'model' => $model,
        'attributes' => [
            //'id',
            'title:ntext',
            //'preview:ntext',
            //'text:ntext',
            //'img',
            //'cat_id',
            //'online',
            //'onblock',
            //'onslider',
            'date',
            //'author',
            //'views',
            //'comments',
            //'conc',
        ],
    ]) ?>

</div>