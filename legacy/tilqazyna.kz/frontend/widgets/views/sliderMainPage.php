<?php

$this->registerCssFile('/css/slider-pro.min.css');
$this->registerJsFile('/js/jquery.sliderPro.min.js', ['depends'=>'yii\web\JqueryAsset']);
$this->registerJs("
			$( '#example5' ).sliderPro({
				width: '100%',
				height: 400,
				orientation: 'vertical',
				loop: false,
				arrows: true,
				buttons: false,
				thumbnailsPosition: 'right',
				thumbnailPointer: true,
				thumbnailWidth: 290,
				breakpoints: {
					800: {
						thumbnailsPosition: 'bottom',
						thumbnailWidth: 270,
						thumbnailHeight: 100
					},
					500: {
						thumbnailsPosition: 'bottom',
						thumbnailWidth: 120,
						thumbnailHeight: 50
					}
				}
			});");
?>
<style>
/*#example5 .sp-caption-container {
	position: relative;
	top: -44px;
	padding: 10px 0;
	background-color: #7F97DA;
}
*/
#example5 .sp-thumbnail {
    background-color: #F0F0F0;
}

#example5 .sp-thumbnail-image-container {
	width: 100px;
	height: 80px;
	overflow: hidden;
	float: left;
}

#example5 .sp-thumbnail-image {
	height: 100%;
}

#example5 .sp-thumbnail-text {
	width: 170px;
    float: right;
    padding: 8px;
/*    background-color: #EEEEEE;*/
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

#example5 .sp-thumbnail-title {
	margin-bottom: 5px;
	text-transform: uppercase;
	color: #333;
}

#example5 .sp-thumbnail-description {
	font-size: 14px;
	color: #333;
}

@media (max-width: 500px) {
	#example5 .sp-thumbnail {
		text-align: center;
	}

	#example5 .sp-thumbnail-image-container {
		display: none;
	}

	#example5 .sp-thumbnail-text {
		width: 120px;
	}

	#example5 .sp-thumbnail-title {
		font-size: 12px;
		text-transform: uppercase;
	}

	#example5 .sp-thumbnail-description {
		display: none;
	}
}

.articles-onslider { width: 96.96969697%; }
@media screen and (max-width:640px){
	.articles-onslider { width: 100%; }
}
	
</style>

<div class="main-page__news-b floated articles-onslider">
<div id="example5" class="slider-pro" style="margin-top: 42px;">
	<div class="sp-slides">
		
        <?php foreach ($slides as $article) :?>
		<div class="sp-slide">
			<a href="/article/<?=$article['id'];?>">
			<img class="sp-image" src="css/images/blank.gif"
				data-src="<?=$article['img']?>"
				data-retina="<?=$article['img']?>"/>
			<div class="sp-caption"><?=$article['title']?></div>
			</a>
		</div>
		<?php endforeach; ?>

	</div>

	<div class="sp-thumbnails">
        <?php foreach ($slides as $article) :?>
		<div class="sp-thumbnail">
			<div class="sp-thumbnail-image-container">
				<img class="sp-thumbnail-image" src="<?=$article['img']?>"/>
			</div>
			<div class="sp-thumbnail-text">
<!--				<div class="sp-thumbnail-title">Lorem ipsum</div>-->
				<div class="sp-thumbnail-description"><?=$article['title']?></div>
			</div>
		</div>
		<?php endforeach; ?>

	</div>
</div>

			</div>