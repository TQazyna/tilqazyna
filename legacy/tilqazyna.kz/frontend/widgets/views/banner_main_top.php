<?php $banner = $banners[0]; ?>
<?php $size = $banner::$sizeList[$banner->pos]; ?>

<?php if($banner['type'] !== 'flash'){?>
    <a target="_blank" href="<?=$banner['link']?>"><img style="width: 100%; max-width: <?php echo $size['width']=='auto'? 'auto' : $size['width'].'px' ?>; height: <?php echo $size['height']=='auto'? 'auto' : $size['height'].'px' ?>;" src="//tilalemi.kz/frontend/web<?php echo $banner['img']?>" alt="<?php //=$banner['title']?>"></a>
<?php }elseif($banner['type'] == 'flash'){?>
    <object width="<?php echo $size['width']?>" height="<?php echo $size['height']?>">
        <param name="movie" value="<?php echo $banner['img']?>">
        <embed src="<?php echo $banner['img']?>" width="<?php echo $size['width']?>" height="<?php echo $size['height']?>">
        </embed>
    </object>
<?php }?>