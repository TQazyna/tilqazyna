<?php

$this->registerCssFile('/skitter/skitter.css?v=1');
$this->registerJsFile('/skitter/jquery.easing.1.3.js', ['depends'=>'yii\web\JqueryAsset']);
$this->registerJsFile('/skitter/jquery.skitter.min.js', ['depends'=>'yii\web\JqueryAsset']);
$this->registerJs("

      $('.skitter-large').skitter({
        numbers: false,
        dots: false,
		stop_over: false
      });

");
?>
    <div class="main-page__news-b floated articles-onslider">
		<style>
			.skitter__title { color:white;}
			.label_skitter p { font-size: 21px; padding: 30px 15px; }
		</style>
		<h3 class="sidebar__title skitter__title">slider</h3>
		<div class="skitter skitter-large">
			<ul>
				<?php $classes = array('cubeHide', 'cubeSize', 'cubeShow', 'cube'); ?>
				<?php foreach ($slides as $k => $article) :?>
				<?php $image = $article['img_slider'] ? $article['img_slider'] : $article['img']; if (strlen($image) > 0) : ?>
				<li><a href="/article/<?=$article['id'];?>"><img src="<?=$image?>" class="cubeShow<?php //echo $classes[$k%4]?>" /></a><div class="label_text"><a href="/article/<?=$article['id'];?>"><p><?=$article['title']?></p></a></div></li>
				<?php endif; ?>
				<?php endforeach; ?>
			</ul>
		</div>
	</div>
	
	