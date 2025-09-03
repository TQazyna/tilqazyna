<?php
$this->registerJs(
    '$("document").ready(function(){
            $("#register").on("pjax:true", function() {
            window.location.href = "/profile";
        });
    });'

);
?>
<div class="overlay js-overlay-b">
    <div class="header__enter-b__overlay js-overlay-form">
        <svg class="header__enter__close js-overlay-close" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 25 25" enable-background="new 0 0 25 25">
            <path fill="#333333" d="M13.482,12.5L24.797,1.186C24.923,1.06,25,0.887,25,0.694C25,0.312,24.689,0,24.306,0c-0.191,0-0.365,0.078-0.491,0.203L12.5,11.518L1.186,0.203C1.06,0.078,0.886,0,0.694,0C0.311,0,0,0.312,0,0.694C0,0.887,0.077,1.06,0.204,1.187L11.518,12.5L0.204,23.814C0.077,23.94,0,24.113,0,24.306C0,24.689,0.311,25,0.694,25c0.192,0,0.366-0.078,0.491-0.203L12.5,13.482l11.314,11.314C23.94,24.922,24.114,25,24.306,25C24.689,25,25,24.689,25,24.306c0-0.192-0.077-0.365-0.203-0.491L13.482,12.5z"/>
        </svg>
        <div class="header__enter__title-b">
            <span class="header__enter__title header__enter__title--active js-enter-tab-link">Кіру</span>
            <span class="header__enter__title js-enter-tab-link">тіркелу</span>
        </div>
        <div class="">
            <div class="js-enter-tab js-enter-tab-active">
                <?php echo \frontend\widgets\Login::widget(); ?>
            </div>
            <div class="js-enter-tab">
                <?php \yii\widgets\Pjax::begin(['id' => 'register']) ?>
                <?php 
                $form = \yii\bootstrap\ActiveForm::begin(['options' => ['data-pjax' => true]]);
                ?>
                <?php echo $form->field($model,'username')->textInput(['class'=>'header__enter__input','placeholder'=>'ЕСІМІ'])->label(false)?>
                <?php $form->field($model,'lastname')->textInput(['class'=>'header__enter__input','placeholder'=>'ТЕГІ'])->label(false)?>
                <?php echo $form->field($model,'email')->textInput(['class'=>'header__enter__input','placeholder'=>'E-MAIL/ЛОГИН:','type'=>'email'])->label(false)?>
                <?php echo $form->field($model,'password')->textInput(['class'=>'header__enter__input','placeholder'=>'КІЛТ СӨЗ *:','type'=>'password'])->label(false)?>
                <?php echo $form->field($model,'repassword')->textInput(['class'=>'header__enter__input','placeholder'=>'КІЛТ СӨЗДІ ҚАЙТАЛАҢЫЗ *','type'=>'password'])->label(false)?>
                <div class="header__enter__checkbox-b">
                    <input type="checkbox" id="2" class="enter-checkbox"><label for="2" class="enter-checkbox-label">Есте сақтау</label>
                </div>
                <div class="header__enter-link-b floated">
                    <button type="submit" class="header__enter-link">Кіру</button> <a href="" class="header__enter-link-reset">Кілт сөзді <br>қалпына келтіру?</a>
                </div>
                <?php
                \yii\bootstrap\ActiveForm::end();
                ?>
                <?php \yii\widgets\Pjax::end(); ?>
            </div>
        </div>
    </div>
</div>