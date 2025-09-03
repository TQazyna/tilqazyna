<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model common\models\Feedback */
/* @var $form yii\widgets\ActiveForm */
?>

<div class="feedback-form">

    <?php $form = ActiveForm::begin(); ?>

    <div class="col-md-8">

        <?= $form->field($model, 'name')->textInput(['id'=>'GrossPay','readonly'=> true])?>

        <?= $form->field($model, 'email')->textInput(['id'=>'GrossPay','readonly'=> true])?>

        <?= $form->field($model, 'message')->textArea(['rows' => '8','readonly'=> true]) ?>

        <?= $form->field($model, 'answer')->textArea(['rows' => '12']) ?>

    </div>
    <div class="col-md-4">
        <?php echo $form->field($model, 'status')->dropDownList(['1'=>'Иә','0'=>'Жоқ']) ?>

        <?= $form->field($model, 'dtime')->textInput(['maxlength' => true]) ?>

        <div class="form-group">
            <?= Html::submitButton($model->isNewRecord ? 'Create' : 'Update', ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-primary']) ?>
        </div>
    </div>

    <?php ActiveForm::end(); ?>

</div>
