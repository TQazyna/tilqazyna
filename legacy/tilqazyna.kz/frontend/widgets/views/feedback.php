<?php
$this->registerJs(
    '$("document").ready(function(){
            $("#feedback").on("pjax:end", function() {
            $("#feedform").css("display","none");
            $("#sucsess").css("display","block");
        });
    });
    '

);
?>
<section class="form__block" id="sForm">
    <div class="container" id="feedfrorm">
        <div class="icon_wrap">
            <i class="icon-pages"></i>
        </div>
        <h2>подайте заявку, пока свободны места!</h2>
        <?php \yii\widgets\Pjax::begin(['id' => 'feedback']) ?>
        <?
        $form = \yii\bootstrap\ActiveForm::begin(['id'=>'feedback_form','options' => ['enctype' => 'multipart/form-data','data-pjax' => true,'class'=>'clearfix'],
            'fieldConfig' => [
                'template' => "{input}",
            ],]);
        ?>
            <div class="column one">
                <div class="field">
                    <?=$form->field($model,'name')->textInput(['data-placeholder' => 'Имя'])->label(false) ?>
                </div>
                <div class="field">
                    <?=$form->field($model,'lastname')->textInput(['data-placeholder' => 'Фамилия'])->label(false) ?>
                </div>
                <div class="field">
                    <?=$form->field($model,'email')->textInput(['data-placeholder' => 'Email'])->label(false) ?>
                </div>
            </div>
            <div class="column two">
                <div class="field">
                    <?=$form->field($model,'tel')->textInput(['data-placeholder' => 'Номер телефона'])->label(false) ?>
                </div>
                <div class="field">
                    <select name="Feedback[role]" data-placeholder="Роль на портале">
                        <option></option>
                        <option>Заказчик</option>
                        <option>Организатор</option>
                        <option>Поставщик</option>
                    </select>
                </div>
                <div class="field">
                    <select  name="Feedback[date]"  data-placeholder="Дата семинара">
                        <option></option>
                        <option>13 - 14 ФЕВРАЛЯ</option>
                        <option>20 - 21 ФЕВРАЛЯ</option>
                    </select>
                </div>
            </div>
            <div class="clearfix"></div>
            <div class="buttons__block">
                <button class="btn hollow">Записаться</button>
            </div>
        <?
        \yii\bootstrap\ActiveForm::end();
        ?>
        <?php \yii\widgets\Pjax::end(); ?>
    </div>
    <div class="form__block_message" style="display: none" id="sucsess">
        <div class="container">
            <p class="text">
                Спасибо, Ваша заявка принята! С Вами обязательно свяжутся в ближайшее время!
            </p>

            <div class="buttons__block">
                <a href="#" class="btn close">Ок</a>
            </div>
        </div>
    </div>
</section>