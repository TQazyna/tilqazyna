<?php

use yii\helpers\Html;


/* @var $this yii\web\View */
/* @var $model common\models\Articles */

$this->title = 'Добавить новости';
$this->params['breadcrumbs'][] = ['label' => 'новости', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="articles-create">

    <?php echo $this->render('_form', [
        'model' => $model,'category'=>$category,
    ]) ?>

</div>
