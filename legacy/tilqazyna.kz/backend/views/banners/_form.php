<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model common\models\Banners */
/* @var $form yii\widgets\ActiveForm */
?>

<div class="banners-form">

    <?php $form = ActiveForm::begin(['options' => ['enctype' => 'multipart/form-data']]); ?>

    <?php echo  $form->field($model, 'title')->textInput(['maxlength' => true]) ?>

    <?php if(!empty($model->img)){?>
	<?php $size = $model::$sizeList[$model->pos]; ?>
    <?php if($model['type'] !== 'flash'){?>
        <img src="<?php echo $model->img?>" style="width: <?php echo $size['width']=='auto'? 'auto' : $size['width'].'px' ?>; height: <?php echo $size['height']=='auto'? 'auto' : $size['height'].'px' ?>;">
    <?php }elseif($model['type'] == 'flash'){?>
        <object width="<?php echo $size['width']?>" height="<?php echo $size['height']?>">
            <param name="movie" value="<?php echo $model->img?>">
            <embed src="<?php echo $model->img?>" width="<?php echo $size['width']?>" height="<?php echo $size['height']?>"></embed>
        </object>
    <?php }?>
    <?php }?>
    <?php echo  $form->field($model, 'file')->fileInput(['class'=>'btn btn-primary']) ?>

    <?php echo  $form->field($model, 'pos')->dropDownList($model::$posList) ?>

    <?php echo  $form->field($model, 'order')->dropDownList($model::$position) ?>

    <?php echo  $form->field($model, 'link')->textInput(['maxlength' => true]) ?>

    <?php echo  $form->field($model, 'published')->checkbox() ?>

    <div class="form-group">
        <?php echo  Html::submitButton($model->isNewRecord ? 'Добавить' : 'Сохранить', ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-primary']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
