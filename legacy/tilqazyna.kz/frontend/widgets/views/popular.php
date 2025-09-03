<div class="sidebar__til-b">
    <h3 class="sidebar__til__title">тіл райы</h3>
    <div class="sidebar__til">
        <?php foreach ($arts as $art) {?>
            <div class="sidebar__til__item">
                <img width="57" height="44" src="<?php echo $art['img']?>" class="sidebar__til__img"/>
                <a href="/article/<?echo $art['id']."-".$art['preview'].".html";?>" class="sidebar__til__link"><?=$art['title']?></a>
            </div>
        <?php }?>
    </div>
</div>