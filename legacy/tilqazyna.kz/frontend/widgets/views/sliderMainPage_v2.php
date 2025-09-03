<?php

$this->registerCssFile('/rs/royalslider.css');
$this->registerCssFile('/rs/rs-default.css');
$this->registerJsFile('/rs/jquery.royalslider.min.js', ['depends'=>'yii\web\JqueryAsset']);
$this->registerJs("
	$('#video-gallery').royalSlider({
    arrowsNav: false,
    fadeinLoadedSlide: true,
    controlNavigationSpacing: 0,
    controlNavigation: 'thumbnails',
    thumbs: {
      autoCenter: false,
      fitInViewport: true,
      orientation: 'vertical',
      spacing: 0,
      paddingBottom: 0
    },
    keyboardNavEnabled: true,
    imageScaleMode: 'fill',
    imageAlignCenter:true,
    slidesSpacing: 0,
    loop: false,
    loopRewind: true,
    numImagesToPreload: 3,
    video: {
      autoHideArrows:true,
      autoHideControlNav:false,
      autoHideBlocks: true,
      youTubeCode: '<iframe src=\"https://www.youtube.com/embed/%id%?rel=1&autoplay=1&showinfo=0\" frameborder=\"no\" allowFullscreen></iframe>'
    }, 
    autoScaleSlider: true, 
    autoScaleSliderWidth: 960,     
    autoScaleSliderHeight: 450,

    /* size of all images http://help.dimsemenov.com/kb/royalslider-jquery-plugin-faq/adding-width-and-height-properties-to-images */
    imgWidth: 640,
    imgHeight: 360

  });

");
?>
    <style>
      #video-gallery {
  max-width: 960px;
  width: 100%;
height:505px;
}
.videoGallery > .rsContent,
.videoGallery > .rsImg {
  visibility:hidden;
}
.videoGallery .rsTmb {
  padding: 20px;
}
.videoGallery .rsThumbs .rsThumb {
  width: 220px;
  height: 80px;
  border-bottom: 1px solid #2E2E2E;
}
.videoGallery .rsThumbs {
  width: 220px;
  padding: 0;
}
.videoGallery .rsThumb:hover {
  background: #000;
}
.videoGallery .rsThumb.rsNavSelected {
  background-color: #02874A;
  border-bottom:-color #02874A;
}
.videoGallery .rsImg {
  position:absolute;
}
.sampleBlock {
  left: 3%; 
  top: 1%; 
  width: 100%;
  max-width: 400px;
}

.rsVideoContainer {
width:100%; 
height:100%; 
overflow:hidden; 
display:block; 
float:left; 
}


@media screen and (min-width: 0px) and (max-width: 500px) {
  .videoGallery .rsTmb {
    padding: 6px 8px;
  }
  .videoGallery .rsTmb h5 {
    font-size: 12px;
    line-height: 17px;
  }
  .videoGallery .rsThumbs.rsThumbsVer {
    width: 100px;
    padding: 0;
  }
  .videoGallery .rsThumbs .rsThumb {
    width: 100px;
    height: 47px;
  }
  .videoGallery .rsTmb span {
    display: none;
  }
  .videoGallery .rsOverflow,
  .royalSlider.videoGallery {
    height: 300px !important;
  }
  .sampleBlock {
    font-size: 14px;
  }
}
/*.rsDefault .rsThumbs { background: #175094; }
.videoGallery .rsThumb:hover { background: #EE7B12; }*/
.videoGallery .rsThumb.rsNavSelected {
    background-color: #EE7B12;
}

    </style>
            <div class="main-page__news-b floated articles-onslider">

<div id="video-gallery" class="royalSlider videoGallery rsDefault">
  <?php foreach ($slides as $article) :?>
	<!--a href="/article/<?=$article['id'];?>"-->
  <a class="rsImg" data-rsw="843" data-rsh="473" href="<?=$article['img']?>">
    <div class="rsTmb">
      <h5><?=$article['title']?></h5>
<!--      <span>by Dmitry Semenov</span>-->
    </div>
  </a>
		<!--/atest-->
  <?php endforeach; ?>
</div>

			</div>