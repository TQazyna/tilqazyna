<?php if($banner['type'] !== 'flash'){?>
    <a target="_blank" href="<?php echo $banner['link']?>"><img width="270" height="526" src="<?php echo $banner['img']?>"></a>
<?php }elseif($banner['type'] == 'flash'){?>
    <object width="270" height="526">
        <param name="movie" value="<?php echo $banner['img']?>">
        <embed src="<?=$banner['img']?>" width="270" height="526">
        </embed>
    </object>
<?php }?>