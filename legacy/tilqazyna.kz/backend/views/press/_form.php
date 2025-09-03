<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;
use vova07\imperavi\Widget;
use kartik\date\DatePicker;
use dosamigos\ckeditor\CKEditor;

/* @var $this yii\web\View */
/* @var $model common\models\Articles */
/* @var $form yii\widgets\ActiveForm */

?>
<div class="articles-form" style="overflow:hidden;">
    <div class="col-md-8">
    <?php $form = ActiveForm::begin(['options' => ['enctype' => 'multipart/form-data']]); ?>

    <?php echo $form->field($model, 'title')->textInput() ?>

    <?php echo $form->field($model, 'text')->widget(CKEditor::className(), [
        'options' => ['rows' => 5],
        'preset' => 'full'
    ]) ?>
    


    

    <div class="form-group">
        <?php echo Html::submitButton($model->isNewRecord ? 'Добавить' : 'Изменить', ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-primary']) ?>
    </div>

    </div>
    <div class="col-md-4">

    <?php echo $form->field($model, 'file')->fileInput(['class'=>'btn btn-primary']) ?>

    <?php echo $form->field($model, 'online')->dropDownList(['2'=>'Нет','1'=>'Да']) ?>

    

    </div>
    <?php ActiveForm::end(); ?>
</div>