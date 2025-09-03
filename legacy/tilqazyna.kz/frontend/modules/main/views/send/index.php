<div class="container">
    <div class="page" style="padding:30px;">

        <h2>Сұрақ-жауап</h2>
        <?php $form = \yii\bootstrap\ActiveForm::begin(['options' => ['data-pjax' => true]]); ?>
        <form class="b-faq-form" method="post">
            <div class="b-faq-form__items">
                <?php echo $form->field($model,'name')->textInput(['class'=>'header__enter__input','placeholder'=>'Сіздің аты-жөңіз ','type'=>'name'])->label(false)?>
            </div>
            <div class="b-faq-form__items">
                <?php echo $form->field($model,'email')->textInput(['class'=>'header__enter__input','placeholder'=>'Электронды поштаңыз ','type'=>'email'])->label(false)?>
            </div>
            <div class="b-faq-form__items">
                <?php echo $form->field($model,'message')->textArea(['rows' => '12','class'=>'header__enter__input','placeholder'=>'Сіздің сұрағыңыз ','type'=>'text'])->label(false)?>
                <?php echo $form->field($model, 'dtime')->hiddenInput(['value'=> date('Y-m-d H:i:s')])->label(false) ?>
            </div>
            <input type="hidden" id="csrf" name="csrf" value="cnRQSWh4RHM0TVpURGJqQUFGRUdydz09">            
            <div class="" style="width:100%;text-align: center; margin: 0 auto;">
                <input type="submit" value="Жолдау" class="b-faq-form__button send-btn" style="width: 150px;">
            </div>
        </form>

        
            <ul><?php foreach($art as $art) {?>
                <li>
                <?php echo $art['id']; ?>
                <br>
                <?php echo $art['name']; ?>
                <br>
                <?php echo $art['email']; ?>
                <br>
                <?php echo $art['dtime']; ?>
                </li>
                <?php } ?>
            </ul>
           
       
    </div>
</div>
