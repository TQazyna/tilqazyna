<?php

$this->registerCssFile('/skitter/skitter.css?v=1');
$this->registerCss("
.skitter .info_slide_dots {
	bottom: 0;
	right: 0;
	width: 100px;
	left: unset !important;
	transform: unset !important;
}
");
$this->registerJsFile('/skitter/jquery.easing.1.3.js', ['depends'=>'yii\web\JqueryAsset']);
$this->registerJsFile('/skitter/jquery.skitter.min.js', ['depends'=>'yii\web\JqueryAsset']);
$this->registerJs("

      $('.skitter-large').skitter({
        numbers: false,
        dots: true,
		stop_over: false,
		interval: 4000
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
				<?php $image = $article['img']; if (preg_match('/(.png|.jpg)/', $image) > 0) : ?>
				<li><a href="/article/<?=$article['id'];?>"><img src="/img_960_400<?=$image?>" class="cubeShow<?php //echo $classes[$k%4]?>" /></a><div class="label_text"><a href="/article/<?=$article['id'];?>"><p><?=$article['title']?></p></a></div></li>
				<?php endif; ?>
				<?php endforeach; ?>
			</ul>
		</div>
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
	<div id="diktant_modal" class="diktant-modal" style="display:block">
		<div class="diktant-content">
			<a class="cl-modal" onclick="oncl();">[x] жабу</a>
			<video id="d_video" style="width:100%" muted autoplay >
				<img src="/img/banner_kk.jpg" style="width:200px; height: 150px;"></img> <!-- <source src="http://emle.kz/assets/banner480.mp4" type="video/mp4"> -->
			</video>
			<p style="text-align:center;margin-top:15px"><a onclick="oncl();" target="_blank" id="open_diktant" class="open_diktant" href="http://tilalemi.kz/article/1793">Толығырақ</a></p>
		</div>
	</div>
				<script>function oncl(){document.getElementById("diktant_modal").style.display = 'none';};</script>
	