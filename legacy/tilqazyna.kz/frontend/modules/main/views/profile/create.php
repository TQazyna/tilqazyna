<?php
$this->title = "Жеке кабинет - Материал қосу";
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="zhazba-page">
    <div class="main-page__in floated">
        <div class="main-page__left">
            <div class="profile-b">
                <div class="main-page__title-b">
                    <h3 class="news__title">ЖАЗБА ЖАЗУ</h3>
                </div>
                <div class="profile__menu-b floated">
                    <div class="profile__menu floated">
                        <span class="profile__menu__item profile__menu__item--active">ЖАЗБА</span>
                        <span class="profile__menu__item">БЕЙНЕ</span>
                        <span class="profile__menu__item">АУДИО</span>
                        <span class="profile__menu__item">КІТАП</span>
                    </div>
                </div>

                <div class="profile__tabs">
                    <div class="profile__tab  profile__tab--active">
                        <?php $form = \yii\widgets\ActiveForm::begin(['options' => ['enctype' => 'multipart/form-data']]); ?>

                        <div class="zhazba__item">
                            <label class="zhazba__label">Тақырып</label>
                            <?= $form->field($model, 'title')->textInput(['class'=>'zhazba__input'])->label(false) ?>
                        </div>
                        <div class="zhazba__item">
                            <label class="zhazba__label">Қысқаша мазмұны</label>
                            <? echo $form->field($model,'prev')->textarea(['class'=>'zhazba__input'])->label(false)?>
                        </div>
                        <div class="zhazba__item">
                            <label class="zhazba__label">Мәтін</label>
                            <?echo $form->field($model, 'text')->widget(\vova07\imperavi\Widget::className(), [

                                'settings' => [
                                    'lang' => 'ru',
                                    'minHeight' => 500,
                                    'imageUpload' => \yii\helpers\Url::to(['/articles/image-upload'])
                                ]
                            ])->label(false)?>
                        </div>
                        <div class="zhazba__item">
                            <label class="zhazba__label">Кілт сөздері</label>
                            <?= $form->field($model, 'conc')->textInput(['class'=>'zhazba__input'])->label(false) ?>
                        </div>
                        <div class="zhazba__item">
                            <button type="submit" class="link">Жариялау</button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
        <div class="sidebar">
            <div class="zhazba__side-b">
                <div class="zhazba__side__item">
                    <label class="zhazba__label">Суретті жүктеңіз</label>
                    <?= $form->field($model, 'file')->fileInput()->label(false) ?>
                </div>
                <div class="zhazba__side__item">
                    <label class="zhazba__label">Категория</label>
                    <?= $form->field($model, 'cat_id')->dropDownList(['14'=>'Толғаныс','13'=>'Тіл райы'])->label(false) ?>
                </div>
            </div>
        </div>
        <?php \yii\widgets\ActiveForm::end(); ?>
    </div>
</div>