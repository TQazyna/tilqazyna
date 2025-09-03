<div class="large-7 medium-7 columns block-slider padding-left">
    <div role="region" data-orbit data-use-m-u-i="true" class="orbit" style="overflow: hidden; max-height: 348px;">
        <ul class="orbit-container" style="overflow: hidden;">
            <button class="orbit-previous"><span class="show-for-sr">Предыдущий</span></button>
            <button class="orbit-next"><span class="show-for-sr">Следующий</span></button>
            <?$i=1; foreach ($arts as $art) {?>
                <li class="orbit-slide <?if($i==1){?>is-active <?}?>">
                    <div class="slide1">
                        <div class="img-center"><img src="<?=$art['img']?>" alt="slide" class="orbit-image"></div>
                        <div class="shadow">
                            <?$cat = \common\models\Articles::getCatById($art['cat_id']);?>
                            <div class="topic-top"><a href="/<?=$cat['alias']?>"><?echo $cat['title']?></a></div>
                            <div class="topic"><a href="/article/<?echo $art['id']."-".$art['preview'].".html";?>"><?=$art['title']?></a></div>
                            <div class="view"><img src="../img/icons/eyes.png" alt="eyes"><span><?=$art['views']?></span></div>
                            <div class="comment"><img src="../img/icons/comments.png" alt="comments"><span><?=$art['comments']?></span></div>
                        </div>
                    </div>
                </li>
                <?$i++;}?>
        </ul>
        <nav class="orbit-bullets">
            <button data-slide="0" class="is-active"><span class="show-for-sr">First slide details.</span><span class="show-for-sr">Current Slide</span></button>
            <button data-slide="1"><span class="show-for-sr">Second slide details</span></button>
            <button data-slide="2"><span class="show-for-sr">Third slide details.</span></button>
        </nav>
    </div>
</div>