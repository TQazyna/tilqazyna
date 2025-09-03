<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;
use vova07\imperavi\Widget;
use kartik\date\DatePicker;
use dosamigos\ckeditor\CKEditor;
use zxbodya\yii2\galleryManager\GalleryManager;

/* @var $this yii\web\View */
/* @var $model common\models\Articles */
/* @var $form yii\widgets\ActiveForm */

?>
<div class="articles-form" style="overflow:hidden;">
    <div class="col-md-8">
    <?php $form = ActiveForm::begin(['options' => ['enctype' => 'multipart/form-data']]); ?>

    <?php echo $form->field($model, 'title')->textInput() ?>

    <?php echo $form->field($model,'prev')->textarea()?>

    <?php echo $form->field($model, 'text')->widget(CKEditor::className(), [
        'options' => ['rows' => 5],
        'preset' => 'full'
    ]) ?>

    <?php
        if ($model->isNewRecord) {
            echo 'Can not upload images for new record';
        } else {
            echo GalleryManager::widget(
                [
                    'model' => $model,
                    'behaviorName' => 'galleryBehavior',
                    'apiRoute' => 'product/galleryApi'
                ]
            );
        }
    ?>
    
    </div>
    <div class="col-md-4">

        <?php
        if(!empty($model->img))
        {
            echo Html::img($model->img, ['class'=>'img-responsive','width'=>'200px']);
        }

        ?>
        <?php echo $form->field($model, 'file')->fileInput(['class'=>'btn btn-primary']) ?>

        <?php
        if(!empty($model->img_slider))
        {
            echo Html::img($model->img_slider, ['class'=>'img-responsive','width'=>'200px']);
        }

        ?>
        <?php $form->field($model, 'file2')->fileInput(['class'=>'btn btn-primary']) ?>

        <?php echo $form->field($model, 'author')->textInput() ?>
        
        <?php $form->field($model, 'cat')->dropDownList(['Тұғыр'=>'Тұғыр','Ақпарат'=>'Ақпарат', 'Әдіс'=>'Әдіс', 'Тіл райы'=>'Тіл райы', 'Тарту'=>'Тарту', 'Толғаныс'=>'Толғаныс', 'Орта'=>'Орта']) ?>
        <?php
        echo $form->field($model, 'date')->widget(DatePicker::classname(), [
            'options' => ['placeholder' => 'Выберите дату'],
            'language'=>'ru',
            'pluginOptions' => [
                'autoclose'=>true,
                'format' => 'd.m.yyyy'
            ]
        ]);
        ?>
        <?php echo $form->field($model, 'time')->textInput() ?>
        <?php echo $form->field($model, 'cat_id')->hiddenInput(['value'=>11])->label(false) ?>

        <?php echo $form->field($model, 'online')->dropDownList(['2'=>'Нет','1'=>'Да']) ?>
        <?php  $form->field($model, 'onslider')->dropDownList(['2'=>'Нет','1'=>'Да']) ?>

        <?php echo $form->field($model, 'conc')->textInput() ?>


    <div class="form-group">
        <?php echo Html::submitButton($model->isNewRecord ? 'Добавить' : 'Изменить', ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-primary']) ?>
    </div>

    </div>
    <?php ActiveForm::end(); ?>
</div>