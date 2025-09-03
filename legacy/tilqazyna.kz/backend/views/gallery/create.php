<?php

use yii\helpers\Html;


/* @var $this yii\web\View */
/* @var $model common\models\Articles */

$this->title = 'Добавить photo';
$this->params['breadcrumbs'][] = ['label' => 'Gallery', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="articles-create">

    <?php echo $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
