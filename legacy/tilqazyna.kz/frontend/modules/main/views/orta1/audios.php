<?php
$this->title = $title;
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="main-page">
    <div class="main-page__in floated">
        <div class="main-page__left">
            <div class="main-page__title-b">
                <h3 class="news__title">Аудио</h3>
            </div>
            <div class="main-page__media-b main-page__media-b--page">
                <div class="main-page__media__items floated">
                    <?
                    $i = 1;
                    foreach ($audios as $audio) {
                        if($i == 1){?>
                            <div class="main-page__media main-page__media--audio main-page__media--main">
                                <div class="main-page__media__text-b">
                                    <?=$audio['title']?>
                                </div>
                                <a href="/article/<?=$audio['id']?>" class="block-link"></a>
                            </div>
                        <?}else{?>
                            <div class="main-page__media main-page__media--audio mobile-640">
                                <div class="main-page__media__text-b">
                                    <?=$audio['title']?>
                                </div>
                                <a href="/article/<?=$audio['id']?>" class="block-link"></a>
                            </div>
                            <?

                        }
                        $i++;
                    }?>
                </div>
            </div>
        </div>
        <div class="sidebar">
            <div class="main-page__title-b"></div>
            <div class="sidebar__sections">
                <div class="sidebar__section__title">Бөлімдер</div>
                <a href="/adis" class="sidebar__section <? if(empty($cat)){echo 'sidebar__section--active';} ?>">Барлығы</a>
                <a href="/adis/kenes" class="sidebar__section <? if($cat == 'kenes'){echo 'sidebar__section--active';} ?>">Ғалымнан кеңес</a>
                <a href="/adis/komek" class="sidebar__section <? if($cat == 'komek'){echo 'sidebar__section--active';} ?>">Әдіскерге көмек</a>
                <a href="/adis/videos" class="sidebar__section <? if($cat == 'videos'){echo 'sidebar__section--active';} ?>">Видео</a>
                <a href="/adis/audios" class="sidebar__section <? if($cat == 'audios'){echo 'sidebar__section--active';} ?>">Аудио</a>
            </div>
            <?php echo \frontend\widgets\More::widget();?>
            <?php echo \frontend\widgets\Popular::widget();?>
        </div>
    </div>
</div>

