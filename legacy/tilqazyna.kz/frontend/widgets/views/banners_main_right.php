<div >
<?php foreach ($banners as $banner) : ?>
<?php $size = $banner::$sizeList[$banner->pos]; ?>
<a target="_blank" href="<?php echo $banner['link']?>"><img style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);margin-bottom:0px; width: 100%; max-width: <?php echo $size['width']=='auto'? 'auto' : $size['width'].'px' ?>; height: <?php echo $size['height']=='auto'? 'auto' : $size['height'].'px' ?>;" src="/frontend/web<?php echo $banner['img']?>" alt="<?php //=$banner['title']?>"><div style="margin: 10px 0;border-bottom: 1px solid #ccc;"></div></a>
<?php endforeach; ?>

</div>