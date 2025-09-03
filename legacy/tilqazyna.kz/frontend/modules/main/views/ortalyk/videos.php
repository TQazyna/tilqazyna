<?php
$this->title = $title;
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="main-page">
    <div class="main-page__in floated">
        <div class="main-page__left">
            <div class="main-page__title-b">
                <h3 class="news__title">Видео</h3>
            </div>
            <div class="main-page__media-b main-page__media-b--page">
                <div class="main-page__media__items floated">
                    <?php
                    $i = 1;
                    foreach ($videos as $video) {?>
                    <a href="/article/<?php echo $video['id']?>">
                        <div class="main-page__media <?php if($i==1){echo 'main-page__media--main';}else{echo 'mobile-640';}?>">
                            <img src="<?php echo \common\components\MyLib\MyLib::getImg($video['id']) ?>" class="main-page__media__img">
                            <div class="main-page__media__text-b">
                                <?php echo $video['title']?>
                            </div>
                        </div>
                    </a>
                    <?php
                    $i++;
                    }
                    ?>
                </div>
            </div>
        </div>
        <div class="sidebar">
            <div class="main-page__title-b"></div>
            <div class="sidebar__sections">
                <div class="sidebar__section__title">Видео</div>

                <?php
                $cats = \common\models\VideoCats::find()->all();
                foreach ($cats as $categ){?>
                <a href="/adis/videos/<?php echo $categ['id']?>" class="sidebar__section <?php if($ids == $categ['id']){echo 'sidebar__section--active';} ?>"><?php echo $categ['title']?></a>
                <?php }?>
            </div>
            <?php echo \frontend\widgets\More::widget();?>
            <?php echo \frontend\widgets\Popular::widget();?>
        </div>
    </div>
</div>

