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
                    <div class="large-12 medium-12 columns">
                        <h1><?=$concurs['title']?></h1>
                        <div data-tabs-content="tabs-concurs" class="tabs-content">
                            <div id="member" class="tabs-panel is-active">
                                <div class="large-12 medium-12 columns  more">
                                    <h3>
                                        <?php
                                            if(!empty($member['other'])){
                                                echo $member['other'];
                                            }else{
                                                echo $member['name'];
                                            }
                                        ?>
                                    </h3>
                                    <small>героиния</small>
                                    <p><?=$member['text']?></p>
                                    <div class="more-events">
                                        <div class="float-left">
                                            <h4><?=$member['name']?></h4><small><?=$member['city']?></small>
                                            <?php $form = \yii\widgets\ActiveForm::begin();?>
                                            <label for="but">

                                            <?=$form->field($model,'voices')->hiddenInput()->label(false)?>
                                            <button name="but" type="submit" value="Голосовать">
                                                <div class="like-more"> <span><?=$member['voices']?></span></div>
                                                </button>
                                            </label>
                                            <?php \yii\widgets\ActiveForm::end();?>
                                        </div>
                                        <div class="center">
                                            <p>Поделитесь с друзьями:
                                                <script type="text/javascript">(function() {
                                                        if (window.pluso)if (typeof window.pluso.start == "function") return;
                                                        if (window.ifpluso==undefined) { window.ifpluso = 1;
                                                            var d = document, s = d.createElement('script'), g = 'getElementsByTagName';
                                                            s.type = 'text/javascript'; s.charset='UTF-8'; s.async = true;
                                                            s.src = ('https:' == window.location.protocol ? 'https' : 'http')  + '://share.pluso.ru/pluso-like.js';
                                                            var h=d[g]('body')[0];
                                                            h.appendChild(s);
                                                        }})();</script>
                                            <div class="pluso" data-background="transparent" data-options="big,round,line,horizontal,nocounter,theme=04" data-services="vkontakte,odnoklassniki,facebook,twitter,google"></div>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <?if(!empty($member['img1'])){?>
                                    <div class="large-12 medium-12 columns"><img src="<?=$member['img1']?>"></div>
                                <?}?>
                                <?if(!empty($member['img2'])){?>
                                    <div class="large-12 medium-12 columns"><img src="<?=$member['img2']?>"></div>
                                <?}?>
                                <?if(!empty($member['img3'])){?>
                                    <div class="large-12 medium-12 columns"><img src="<?=$member['img3']?>"></div>
                                <?}?>
                                <?if(!empty($member['img4'])){?>
                                    <div class="large-12 medium-12 columns"><img src="<?=$member['img4']?>"></div>
                                <?}?>
                                <?if(!empty($member['img5'])){?>
                                    <div class="large-12 medium-12 columns"><img src="<?=$member['img5']?>"></div>
                                <?}?>

                                <div class="large-12 medium-12 columns comments">
                                    <?echo \frontend\widgets\Comments::widget();?>
                                </div>
                                <div class="clearfix"></div>
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