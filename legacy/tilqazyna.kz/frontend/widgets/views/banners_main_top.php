
<style>
    /*.banners_main_top { display:block; max-width:1290px; height:auto; overflow: hidden; }
    .banners_main_top a { display: block; max-width: 1290px; height: auto; margin: auto auto; }*/
</style>
<div class="banners_main_top">
<?php foreach ($banners as $index=>$banner) : ?>
<?php $size = $banner::$sizeList[$banner->pos]; ?>

<?php if($banner['type'] !== 'flash'){?>
    <a target="_blank" href="<?php echo $banner['link']?>" <?php if ($index > 0):?>style="display: none;"<?php endif;?>><img style="width: 100%; max-width: <?php echo $size['width']=='auto'? 'auto' : $size['width'].'px' ?>; height: <?php echo $size['height']=='auto'? 'auto' : $size['height'].'px' ?>;" src="http://tilalemi.kz/frontend/web<?php echo $banner['img']?>" alt="<?php //=$banner['title']?>"></a>
<?php }elseif($banner['type'] == 'flash'){?>
    <object width="<?php echo $size['width']?>" height="<?php echo $size['height']?>" <?php if ($index > 0):?>style="display: none;"<?php endif;?>>
        <param name="movie" value="<?php echo $banner['img']?>">
        <embed src="<?php echo $banner['img']?>" width="<?php echo $size['width']?>" height="<?php echo $size['height']?>">
        </embed>
    </object>
<?php }?>

<?php endforeach; ?>
</div>
<script>
	//$(function() {
		setInterval(function() {
			$('.banners_main_top').animate({opacity:0}, 'slow', function() {
				$('.banners_main_top').append($('.banners_main_top a:eq(0)')).animate({opacity:1}, 'slow');
				$('.banners_main_top a').hide();$('.banners_main_top a:eq(0)').show();
			})
		}, 5000);
	//});
</script>