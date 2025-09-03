<?php

use yii\helpers\Html;
use yii\widgets\DetailView;

/* @var $this yii\web\View */
/* @var $model common\models\User */

$this->title = $model->id;
$this->params['breadcrumbs'][] = ['label' => 'Users', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="user-view">

    <h1><?= Html::encode($this->title) ?></h1>


    <?= DetailView::widget([
        'model' => $model,
        'attributes' => [
            //'id',
            //'auth_key',
            //'password_hash',
            //'password_reset_token',
           // 'email:email',
            //'status',
            //'created_at',
            //'updated_at',
            'lastname',
            //'company',
            'username',
            //'posts',
        ],
    ]) ?>

</div>
