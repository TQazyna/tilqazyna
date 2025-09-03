<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;
use vova07\imperavi\Widget;
use kartik\date\DatePicker;

/* @var $this yii\web\View */
/* @var $model common\models\Articles */
/* @var $form yii\widgets\ActiveForm */

?>
<div class="articles-form" style="overflow:hidden;">
    <div class="col-md-11">
    <?php $form = ActiveForm::begin(['options' => ['enctype' => 'multipart/form-data']]); ?>

    <?php echo $form->field($model, 'title')->textInput() ?>


    <?php echo $form->field($model, 'text')->widget(Widget::className(), [

        'settings' => [
            'lang' => 'ru',
            'minHeight' => 600,
            'imageUpload' => \yii\helpers\Url::to(['/articles/image-upload'])
        ]
    ]);?>
    <?php $form->field($model, 'category')->hiddenInput(['value' => '11']); ?>
    </div>
    <div class="col-md-1">



    <div class="form-group">
        <?php echo Html::submitButton($model->isNewRecord ? 'Добавить' : 'Изменить', ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-primary']) ?>
    </div>

    </div>
    <?php ActiveForm::end(); ?>
</div>