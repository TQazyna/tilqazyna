        <h4>Добавьте комментарий</h4>
        <div class="add-comments">
            <?php /*\yii\widgets\Pjax::begin(['id' => 'comments']) */?>
            <?
            $form = \yii\bootstrap\ActiveForm::begin();
            ?>

            <?=$form->field($model,'text')->textarea(['placeholder'=>'Оставьте свой комментарий'])->label(false)?>
            <?= $form->field($model, 'captcha')->widget(\yii\captcha\Captcha::classname(), [
                //'captchaAction' => 'site/captcha',
            ])->label(false) ?>

            <div class="float-right">
                <button type="submit" class="button-purple">Добавить</button>
            </div>
            <?
            \yii\bootstrap\ActiveForm::end();
            ?>
            <?php /*\yii\widgets\Pjax::end(); */?>
                <div class="clearfix"></div>

        </div>
        <?php if(!empty($comments)): ?>
        <h4>Комментарии</h4>
        <? foreach ($comments as $comment) {?>
            <div class="add-comments comment">
                <div class="comment-block">
                    <h3><?=$comment['author_id']?></h3><small><?=$comment['date']?></small>
                    <p><?=$comment['text']?></p>
                </div>
            </div>
        <?}?>
        <?php endif;?>


