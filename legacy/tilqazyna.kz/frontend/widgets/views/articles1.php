<?php
$this->registerJs(
    '
    var num = 15; //чтобы знать с какой записи вытаскивать данные

    $(function() {
        $("#load").click(function(){ //Выполняем если по кнопке кликнули
            //$("#imgLoad").show(); //Показываем прелоадер
            $.ajax({
                url: "/main/cats/loadmain",
                type: "GET",
                data: {"num": num},
                cache: false,
                success: function(response){
                    if(response == 0){  // смотрим ответ от сервера и выполняем соответствующее действие

                        $("#load").hide();
                    }else{
                        $("#content").append(response);
                        num = num + 15;
                        //$("#imgLoad").hide();
                    }
                }
            });
        });
    });
    '

);
?>
<div class="container-block" >
    <?
    $i=1;
    foreach ($arts as $art) {?>
        <div class="block-3 text-center grid <?if($i%3==0){echo 'pink';}?>">
            <?$cat = \common\models\Articles::getCatById($art['cat_id']);?>
            <div class="topic-top"><a href="/<?=$cat['alias']?>"><?echo $cat['title']?></a></div>
            <div class="info">
                <div class="img-center"><img width="100%" src="<?=$art['img']?>" alt=""></div><a href="/article/<?echo $art['id']."-".$art['preview'].".html";?>"><?=$art['title']?></a>
                <hr>
                <div class="info-views"><img src="../img/icons/eyes.png" alt="eyes"><span><?=$art['views']?></span><img src="../img/icons/comments.png" alt="comments"><span><?=$art['comments']?></span></div>
            </div>
        </div>
    <?$i++;}
    ?>
    <div class="block-3 text-center grid ">
    </div>
</div>
<div class="right-sidebar">
    <div class="block-3 text-center grid">
        <div class="info">
            <?php echo \frontend\widgets\Banners::widget(["pos"=>"main_top"]);?>
        </div>
    </div>
    <?echo \frontend\widgets\Popular::widget();?>
    <div class="block-3 text-center grid">
        <div class="info">
            <?php echo \frontend\widgets\Banners::widget(["pos"=>"main_bottom"]);?>
        </div>
    </div>
</div>
<div class="container-block competitions">
    <div class="block-3 text-center competitions-block">
        <h3>Конкурсы</h3>
        <div class="border"><img src="../img/concurs.png" alt="">
            <p>Каждая наша Леди - прекрасная Девушка, Супруга, Мама, Любимая, Сестра.... Рассказывайте нам о себе, своих талантах, либо о тех Леди, которые Вас вдохновляют, а мы каждый месяц будем выбирать три истории, авторы которых получат призы!</p>
            <a href="/concurse">
                <button class="button button-purple">Участвовать</button></a>
            <h4>Лидеры конкурса</h4>
            <div class="row">
                <div class="leaders">
                    <? foreach ($members as $member) {?>
                        <div class="leader large-3 columns"><a style="display: block; border-radius: 50%; height: 170px; width: 170px; overflow: hidden;margin: auto;" href="/concurse/member/<?=$member['id']?>"> <img style="width: 100%;height: 100%;"  src="<?=$member['img1']?>" alt="leader1" class="round-img"></a>
                            <p><a  href="/concurse/member/<?=$member['id']?>"> <b><?=$member['name']?></b></a></p>
                            <div class="heart"><a href="#"> <img src="../img/icons/heart.png" alt="heart-icon"></a><span><?=$member['voices']?></span></div>
                        </div>
                    <?}?>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="container-block" id="content">
    <?
    $i=1;
    foreach ($arts2 as $art) {?>
        <div class="block-3 text-center grid <?if($i%3==0){echo 'pink';}?>">
            <?$cat = \common\models\Articles::getCatById($art['cat_id']);?>
            <div class="topic-top"><a href="/<?=$cat['alias']?>"><?echo $cat['title']?></a></div>
            <div class="info">
                <div class="img-center"><img width="100%" src="<?=$art['img']?>" alt=""></div><a href="/article/<?echo $art['id']."-".$art['preview'].".html";?>"><?=$art['title']?></a>
                <hr>
                <div class="info-views"><img src="../img/icons/eyes.png" alt="eyes"><span><?=$art['views']?></span><img src="../img/icons/comments.png" alt="comments"><span><?=$art['comments']?></span></div>
            </div>
        </div>
        <?$i++;}
    ?>

    <div class="block-3 text-center grid ">
    </div>
</div>