<?php 
use yii\widgets\DetailView;
use yii\helpers\Html;
use yii\helpers\ArrayHelper;
use common\models\Conference;
use yii\widgets\ActiveForm; 
use yii\widgets\Pjax;

use yii\widgets\modal;

?>
<div class="content">
    <div class="main-register">
    <h2><?php echo \Yii::t('content', 'Тіркелу'); ?></h2>

<div class="register-pages floated">
    
<?php $form = ActiveForm::begin(['options' => ['enctype' => 'multipart/form-data']]); ?>
<ol>
<li><label class="labels"><?php echo \Yii::t('content', 'Конференцияны таңдаңыз'); ?>: </label><?php echo $form->field($model, 'title')->label(false)->dropDownList(\yii\helpers\ArrayHelper::map($art, 'id', 'title')); ?></li>
                <?php //echo $form->field($model,'title')->textInput(['class'=>'header__enter__input','placeholder'=>'title:'])->label(false) ?>
                <li><label class="labels"><?php echo \Yii::t('content', 'Мақала атауы'); ?>: </label><?php echo $form->field($model,'article')->textInput(['class'=>'header__enter__input','placeholder'=>''])->label(false) ?></li>
                <li><label class="labels"><?php echo \Yii::t('content', 'Авторлардың аты-жөні'); ?>: </label><?php echo $form->field($model,'fio')->textInput(['class'=>'header__enter__input','placeholder'=>''])->label(false) ?></li>
                <li><label class="labels"><?php echo \Yii::t('content', 'Мемлекет / қала атауы'); ?>: </label><?php echo $form->field($model,'country')->textInput(['class'=>'header__enter__input','placeholder'=>''])->label(false) ?></li>
                <li><label class="labels"><?php echo \Yii::t('content', 'Оқу / Жұмыс орын атауы, лауазымыңыз'); ?>: </label><?php echo $form->field($model,'position')->textInput(['class'=>'header__enter__input','placeholder'=>''])->label(false) ?></li>
                <li><label class="labels"><?php echo \Yii::t('content', 'Байланыс номеріңіз'); ?>: </label><?php echo $form->field($model,'tel')->textInput(['class'=>'header__enter__input','placeholder'=>''])->label(false) ?></li>
                <li><label class="labels">Email: </label><?php echo $form->field($model,'email')->textInput(['class'=>'header__enter__input','placeholder'=>'@mail'])->label(false) ?></li>
                <li><label class="labels"><?php echo \Yii::t('content', 'Сертификат қажет пе?'); ?> </label><?php echo $form->field($model, 'cert')->label(false)->dropDownList([
                    '0' => "Yii::t('content', 'Жіберу') ",
                    '1' => 'Иә',
                ]); ?></li>




                   
</ol>
<li><?php echo $form->field($model, 'file')->fileInput(['class'=>'btn btn-primary']) ?></li> 
               
                <div class="form-group">
                    <div class="col-lg-offset-2 col-lg-11">
                        <?php echo Html::submitButton('Тіркелу', ['class' => 'btn btn-primary']) ?>
                    </div>
                    
                </div>
                
        <?php ActiveForm::end() ?>

             <pre> <?php var_dump($model); ?> </pre><!-- pre -->

</div>






    

