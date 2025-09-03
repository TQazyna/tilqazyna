<?php if($banner['type'] !== 'flash'){?>
    <a target="_blank" href="<?php echo $banner['link']?>"><img width="1200" height="168" src="<?=$banner['img']?>"></a>
<?php }elseif($banner['type'] == 'flash'){?>
    <object width="1200" height="168">
        <param name="movie" value="<?=$banner['img']?>">
        <embed src="<?=$banner['img']?>" width="1200" height="168">
        </embed>
    </object>
<?php }?>