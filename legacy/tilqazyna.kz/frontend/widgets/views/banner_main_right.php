<div >
<?php  $banner = $banners[0]; ?>
<?php  $size = $banner::$sizeList[$banner->pos]; ?>

<?php if($banner['type'] !== 'flash'){?>
    <a target="_blank" href="<?php =$banner['link']?>"><img style="width: 100%; max-width: <?php =$size['width']=='auto'? 'auto' : $size['width'].'px' ?>; height: <?php =$size['height']=='auto'? 'auto' : $size['height'].'px' ?>;" src="/frontend/web<?php =$banner['img']?>" alt="<?php //=$banner['title']?>"></a>
<?php }elseif($banner['type'] == 'flash'){?>
    <object width="<?php =$size['width']?>" height="<?php =$size['height']?>">
        <param name="movie" value="<?php =$banner['img']?>">
        <embed src="<?php =$banner['img']?>" width="<?php =$size['width']?>" height="<?php =$size['height']?>">
        </embed>
    </object>
<?php }?>

<?php  if (isset($_GET['t'])) : ?>
<?php  foreach ($banners as $banner) : ?>
<?php  $size = $banner::$sizeList[$banner->pos]; ?>
<a target="_blank" href="<?php =$banner['link']?>"><img style="width: 100%; max-width: <?php =$size['width']=='auto'? 'auto' : $size['width'].'px' ?>; height: <?php =$size['height']=='auto'? 'auto' : $size['height'].'px' ?>;" src="/frontend/web<?php =$banner['img']?>" alt="<?php //=$banner['title']?>"></a>
<?php  endforeach; ?>
<?php  endif; ?>
</div>


<style>
	.diktant-modal{
	    position: fixed;
	    z-index: 9999;
	    left: 0;
	    top: 0;
	    width: 100%;
	    height: 100%;
	    background-color: rgb(0,0,0);
	    background-color: rgba(0,0,0,0.4);
	}
	.diktant-content {
	    background-color: #fefefe;
	    margin: auto;
	    width:640px;
		height:430px;
	    padding: 25px;
	    border-radius: 10px;
		position:absolute;
		left:0;
		right:0;
		top:0;
		bottom:0;
	}
	.open_diktant {
	    padding: 10px 45px;
	    background: #1fb771;
	    color: #fff;
	}
	.cl-modal {
		position: absolute;
		    color: #fff;
		    right: 30px;
		    top: 30px;
		    font-size: 12px;
			cursor:pointer;
			z-index:9999;
			padding:3px;
			border-radius:3px;
	}
	.cl-modal:hover{
		background:#fff;color:#458d9e;
	}
	.open_diktant:hover{background:#225d39;}
</style>
<div class="diktant-modal" >
	<div class="diktant-content">
		<a class="cl-modal">[x] жабу</a>
		<video id="d_video" style="width:100%" muted autoplay >
			<source src="//emle.kz/assets/banner480.mp4" type="video/mp4">
		</video>
		<p style="text-align:center"><a class="open_diktant" href="//emle.kz/articles/get/201">Толығырақ</a></p>
	</div>
</div>
			<script>
				$(document).ready(function () {
					$('.cl-modal').on('click',function() {
						$('.diktant-modal').hide();
					});
				});
			</script>
