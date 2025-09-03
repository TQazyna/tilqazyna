<?php

$this->registerCssFile('/rs/royalslider.css');
$this->registerCssFile('/rs/rs-default.css');
$this->registerJsFile('/rs/jquery.royalslider.min.js', ['depends'=>'yii\web\JqueryAsset']);
$this->registerJs("

  $('#gallery-1').royalSlider({
    fullscreen: {
      enabled: false,
      nativeFS: true
    },
	autoPlay: {
    	// autoplay options go gere
    	enabled: true,
    	pauseOnHover: false,
		delay: 3000
    },
    controlNavigation: 'thumbnails',
    autoScaleSlider: true, 
    autoScaleSliderWidth: 960,     
    autoScaleSliderHeight: 450,
    loop: false,
    imageScaleMode: 'fit-if-smaller',
    navigateByClick: true,
    numImagesToPreload:2,
    arrowsNav:true,
    arrowsNavAutoHide: true,
    arrowsNavHideOnTouch: true,
    keyboardNavEnabled: true,
    fadeinLoadedSlide: true,
    globalCaption: true,
    globalCaptionInside: false,
    thumbs: {
      appendSpan: true,
      firstMargin: true,
      paddingBottom: 4
    }
  });

    $('.rsContainer').on('touchmove touchend', function(){});

");
?>
    <style>
      #gallery-1 {
		  margin-top:2px;
  width: 100%;max-width: 960px;
  /*height:627px;*/
  height: auto;
  -webkit-user-select: none;
  -moz-user-select: none;  
  user-select: none;
}
.royalSlider > .rsImg {
  visibility:hidden;
}
.royalSlider img {
}
.rsWebkit3d .rsSlide {
    -webkit-transform: none;
}
.rsWebkit3d img {
    -webkit-transform: translateZ(0);
}
.rsDefault .rsGCaption {
	font-size: 18px;
	font-weight: bold;
	/*background: #EE7B12;*/
	background: #F0F1F3;
	color: #EE7B12;
	padding: 5px 10px;
}
.rsDefault .rsThumb.rsNavSelected {background: #EE7B12}
.rsDefault, .rsDefault .rsOverflow, .rsDefault .rsSlide, .rsDefault .rsVideoFrameHolder, .rsDefault .rsThumbs { background:white; }
.rsDefault .rsArrowIcn { background-color:#EE7B12; }
    </style>
            <div class="main-page__news-b floated articles-onslider">

  <div id="gallery-1" class="royalSlider rsDefault">
  <?php foreach ($slides as $article) :?>
  <?php $image = $article['img_slider'] ? $article['img_slider'] : $article['img']; if (strlen($image) > 0) : ?>
	<div class="rsContent">
	<a href="/article/<?=$article['id'];?>"><img class="rsImg" src="<?=$image?>" /></a>
	<img width="96" height="72" class="rsTmb" src="<?=$image?>" />
	<a class="rsGCaption" href="/article/<?=$article['id'];?>"><?=$article['title']?></a>
	</div>
  <?php endif; ?>
  <?php endforeach; ?>
  </div>
			</div>