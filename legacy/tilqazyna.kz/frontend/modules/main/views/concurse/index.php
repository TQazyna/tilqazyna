<?php
$this->title = "Конкурс - ".$concurs['title'];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="row">
    <div class="large-12 medium-12 columns large-centered concurs">
        <div class="row">
            <div class="large-9 medium-9 columns lades padding-left">
                <nav aria-label="You are here:" role="navigation">
                    <ul class="breadcrumbs">
                        <li><a href="/">Главная</a></li>
                        <li class="disabled"><a href="/concurse">Конкурс</a></li>
                    </ul>
                </nav>
                <div class="row">
                    <div class="large-12 columns">
                        <h1><?=$concurs['title']?></h1>
                        <ul id="tabs-concurs" data-tabs class="tabs">
                            <li class="tabs-title is-active"><a href="#about-concurs" aria-selected="true">О конкурсе</a></li>
                            <li class="tabs-title"><a href="#rules" aria-selected="true">Правила</a></li>
                            <li class="tabs-title"><a href="#member" aria-selected="true">Участницы</a></li>
                            <li class="tabs-title"><a href="#prise" aria-selected="true">Призы</a></li>
                            <li class="tabs-title"><a href="#winner" aria-selected="true">Победители</a></li>
                            <div class="float-right date"><span>Апрель 2016</span></div>
                        </ul>
                        <div data-tabs-content="tabs-concurs" class="tabs-content">
                            <div id="about-concurs" class="tabs-panel is-active text-center">
                                <h2><?=$concurs['title']?></h2>
                                <?=$concurs['description']?>
                                <p class="purple">Для того чтобы стать участником заполните анкету.</p>
                                <div class="text-left">
                                    <div class="row">
                                        <div class="large-7 medium-7 columns ">

                                    <?
                                    $form = \yii\bootstrap\ActiveForm::begin(['options' => ['enctype' => 'multipart/form-data']]);
                                    ?>
                                    <?=$form->field($model,'name')->textInput(['type'=>'text'])?>
                                    <?=$form->field($model,'other')->textInput(['type'=>'text'])->label('Напишите имя героинии (если вы пишите не о себе).')?>
                                    <?=$form->field($model,'email')->textInput(['type'=>'email'])?>
                                    <?=$form->field($model,'city')->textInput(['type'=>'text'])?>
                                    <?=$form->field($model,'text')->textarea(['options' => ['rows' => 22]])?>
                                    <?= $form->field($model, 'file1')->fileInput(['class'=>'btn btn-primary']) ?>
                                    <?= $form->field($model, 'file2')->fileInput() ?>
                                    <?= $form->field($model, 'file3')->fileInput() ?>
                                    <?= $form->field($model, 'file4')->fileInput() ?>
                                    <?= $form->field($model, 'file5')->fileInput() ?>

                                    <button class="button-purple">Участвовать</button>

                                    <?
                                    \yii\bootstrap\ActiveForm::end();
                                    ?>


                                        </div>
                                        </div>
                                </div>


                            </div>
                            <div id="rules" class="tabs-panel">
                                <h3>Правила конкурса </h3>

                                <?=$concurs['pravila']?>
                            </div>
                            <div id="member" class="tabs-panel">
                                <? foreach ($members as $member) {?>
                                    <div class="large-4 medium-4 columns" style=" margin-bottom: 30px;">
                                        <div style="width: 100%;height: 150px;overflow: hidden;">
                                            <img width="100%" src="<?=$member['img1']?>">
                                        </div>
                                        <div class="name float-left">
                                            <h4><a href="/concurse/member/<?=$member['id']?>"><?=$member['name']?></a></h4>
                                            <p><?=$member['city']?></p>
                                        </div>
                                        <div class="like float-right text-center">
                                            <p><img src="/img/icons/heart.png" alt="heart-icon"></p>
                                            <p><small><?=$member['voices']?></small></p>
                                        </div>
                                    </div>
                                <?}?>
                                <!--<div class="large-12 columns comments">
                                    <h4>Добавьте комментарий</h4>
                                    <div class="add-comments">
                                        <form>
                                            <textarea placeholder="Оставьте свой комментарий"></textarea>
                                            <div class="float-left"><img src="img/captcha.jpg" alt="captcha"></div>
                                            <div class="float-right">
                                                <button class="button-purple">Участвовать</button>
                                            </div>
                                            <div class="clearfix"></div>
                                        </form>
                                    </div>
                                    <h4>Комментарий</h4>
                                    <div class="add-comments comment">
                                        <form>
                                            <textarea placeholder="Оставьте свой комментарий"></textarea>
                                            <input type="text" name="answer" placeholder="Ответить">
                                        </form>
                                    </div>
                                </div>-->
                                <div class="clearfix"></div>
                            </div>
                            <div id="prise" class="tabs-panel">
                                <?=$concurs['prizy']?>
                                <div class="clearfix"></div>
                            </div>
                            <div id="winner" class="tabs-panel">
                                <div class="winner text-center">
                                    <h2>Победительницы</h2>
                                    <p>Победители конкурса за прошлый месяц</p>
                                    <div class="large-12 columns">
                                        <h3>Март 2016</h3>
                                    </div>
                                    <div class="hr"></div>
                                    <?/* foreach ($winners as $winner) {*/?><!--
                                        <div class="large-4 columns"><img src="<?/*=$winner['img1']*/?>" alt="member">
                                            <div class="name text-center">
                                                <h4><?/*=$winner['name']*/?></h4><small><?/*=$winner['city']*/?></small>
                                            </div>
                                        </div>
                                    --><?/*}*/?>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-sidebar">
                <div class="block-3 text-center grid">
                    <div class="info"><?php echo \frontend\widgets\Banners::widget(["pos"=>"enter_top"]);?></div>
                </div>
                <?echo \frontend\widgets\Popular::widget();?>
            </div>
        </div>
    </div>
</div>