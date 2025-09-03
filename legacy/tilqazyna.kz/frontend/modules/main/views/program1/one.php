<?php
$this->title = $uzdik['title'];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="kitap-page">
    <div class="main-page__in floated">
        <div class="main-page__left">
            <div class="breadcrumb-b">
                <span class="breadcrumb">Тұғыр   /   Мемлекеттік тіл және БАҚ   /     </span>
            </div>
            <div class="kitap-page__item floated">
                <div class="kitap-page__img-b">
                    <img src="<?=$uzdik['img']?>" class="kitap-page__img"/>
                    <a href="/books/<?=$uzdik['link']?>.pdf" target="_blank" class="kitap-page__link">Оқу</a>
                    <div class="kitap-page__social-b">
                        <script type="text/javascript">(function() {
                                if (window.pluso)if (typeof window.pluso.start == "function") return;
                                if (window.ifpluso==undefined) { window.ifpluso = 1;
                                    var d = document, s = d.createElement('script'), g = 'getElementsByTagName';
                                    s.type = 'text/javascript'; s.charset='UTF-8'; s.async = true;
                                    s.src = ('https:' == window.location.protocol ? 'https' : 'http')  + '://share.pluso.ru/pluso-like.js';
                                    var h=d[g]('body')[0];
                                    h.appendChild(s);
                                }})();</script>
                        <div class="pluso" data-background="transparent" data-options="medium,round,line,horizontal,nocounter,theme=04" data-services="vkontakte,odnoklassniki,facebook,twitter,google"></div>

                    </div>
                </div>
                <div class="kitap-page__info-b">
                    <h2 class="kitap-page__title"><?=$uzdik['title']?></h2>
                    <div class="kitap-page__author-b">
                        <?=$uzdik['author']?>
                    </div>
                    <div class="kitap-page__section">
                        <?php
                            echo \common\models\BooksCat::findOne($uzdik['Uzdik_cat'])['title'];
                        ?>
                    </div>
                    <div class="kitap-page__about-b">
                        <h4 class="kitap-page__about__title">Сипаттама</h4>
                        <p class="kitap-page__about__text">
                            <?=$uzdik['des']?>
                        </p>
                    </div>
                </div>
            </div>
            <div class="review-b">
                <h4 class="review__title">Пікір қосу</h4>
                <div id="mc-container"></div>
                <script type="text/javascript">
                    cackle_widget = window.cackle_widget || [];
                    cackle_widget.push({widget: 'Comment', id: 46463});
                    (function() {
                        var mc = document.createElement('script');
                        mc.type = 'text/javascript';
                        mc.async = true;
                        mc.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://cackle.me/widget.js';
                        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(mc, s.nextSibling);
                    })();
                </script>
                <style>
                    .mc-nav{
                        display: none !important;
                    }
                    .mc-nocomments{
                        display: none !important;
                    }
                </style>
            </div>
            <h3 class="news-item__title">Сондай-ақ, оқи отырыңыз</h3>

            <div class="main-page__tartu-b main-page__tartu-b--page">
                <div class="main-page__tartu__items floated">
                    <? foreach ($mores as $more) {?>
                        <div class="main-page__tartu main-page__tartu--page">
                            <div class="main-page__tartu__img-b">
                                <img src="<?=$more['img']?>" class="main-page__tartu__img">
                                <div class="main-page__tartu__link-b js-tartu-link">
                                    <a href="/tartu/one/<?=$more['id']?>" class="main-page__tartu__link js-tartu-b" style="display: none;">Оқу</a>
                                </div>
                            </div>
                            <a href="" class="main-page__tartu__section"><?=$more['title']?></a>
                            <div class="main-page__tartu__author"><?=$more['author']?></div>
                        </div>
                    <?}?>

                </div>
            </div>
        </div>
        <div class="sidebar">
            <?php echo \frontend\widgets\More::widget();?>
        </div>
    </div>

</div>
