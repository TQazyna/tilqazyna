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
    <div class="col-md-8">
        <?php $form = ActiveForm::begin(['options' => ['enctype' => 'multipart/form-data']]); ?>

        <?php echo $form->field($model, 'title')->textInput() ?>

        <?php echo $form->field($model, 'prev')->textarea() ?>

        <?php echo $form->field($model, 'text')->widget(Widget::className(), [

            'settings' => [
                'lang' => 'ru',
                'minHeight' => 600,
                'imageUpload' => \yii\helpers\Url::to(['/articles/image-upload'])
            ]
        ]); ?>
    </div>
    <div class="col-md-4">

        <?php
        if (!empty($model->img)) {
            echo Html::img($model->img, ['class' => 'img-responsive', 'width' => '200px']);
        }

        ?>
        <?php echo $form->field($model, 'file')->fileInput(['class' => 'btn btn-primary']) ?>

        <?php
        if (!empty($model->img_slider)) {
            echo Html::img($model->img_slider, ['class' => 'img-responsive', 'width' => '200px']);
        }

        ?>
        <?php $form->field($model, 'file2')->fileInput(['class' => 'btn btn-primary']) ?>

        <?php echo $form->field($model, 'author')->textInput() ?>

        <?php echo $form->field($model, 'cat')->dropDownList(['Аудиоархив' => 'Аудиоархив', 'Бейнеархив' => 'Бейнеархив', 'Бақ' => 'Бақ', 'Баспасөз' => 'Баспасөз']) ?>
        <?php
        echo $form->field($model, 'date')->widget(DatePicker::classname(), [
            'options' => ['placeholder' => 'Выберите дату'],
            'language' => 'ru',
            'pluginOptions' => [
                'autoclose' => true,
                'format' => 'd.m.yyyy'
            ]
        ]);
        ?>
        <?php echo $form->field($model, 'time')->textInput() ?>
        <?php echo $form->field($model, 'cat_id')->hiddenInput(['value' => 12])->label(false) ?>

        <?php echo $form->field($model, 'online')->dropDownList(['2' => 'Жоқ', '1' => 'Иә']) ?>
        <?php $form->field($model, 'onslider')->dropDownList(['2' => 'Жоқ', '1' => 'Иә']) ?>

        <?php echo $form->field($model, 'conc')->textInput() ?>


        <div class="form-group">
            <?php echo Html::submitButton($model->isNewRecord ? 'Добавить' : 'Изменить', ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-primary']) ?>
        </div>

    </div>
    <?php ActiveForm::end(); ?>
</div>