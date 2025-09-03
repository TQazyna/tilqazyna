<?php

use yii\helpers\Html;
use frontend\assets\MainAsset;

MainAsset::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>" class="no-js">

<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <?= Html::csrfMetaTags() ?>
    <meta name="keywords" content="Тіл-Қазына, til-qazyna, байқау, латын, тіл орталық" />
    <link href='https://fonts.googleapis.com/css?family=Tinos:700' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,600italic,800,300&subset=latin,cyrillic-ext,cyrillic' rel='stylesheet' type='text/css'>
    <link href='//fonts.googleapis.com/css?family=Lato:300,400,700,300italic,400italic,700italic|Lora:400,700,400italic,700italic|Merriweather:400italic,400,300italic,300,700,700italic|Open+Sans:300italic,400italic,700italic,700,300,400&subset=latin,cyrillic-ext,greek-ext,greek,devanagari,vietnamese,latin-ext,cyrillic' rel='stylesheet' type='text/css'>
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <!-- <script src="https://kazconf.com/js/jquery-3.4.1.min.js"></script> -->
    <title><?= Html::encode($this->title) ?></title>
    
    <!-- Facebook Meta Tags -->
    <meta property="og:url" content="<?= Yii::$app->request->hostInfo ?>">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Шайсұлтан Шаяхметов атындағы «Тіл Қазына» ұлттық ғылыми-практикалық орталығы">
    <meta property="og:description" content="Шайсұлтан Шаяхметов атындағы «Тіл Қазына» ұлттық ғылыми-практикалық орталығы">
    <meta property="og:image" content="<?= Yii::$app->request->hostInfo ?>/NewLogo.svg">

    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta property="twitter:domain" content="tilqazyna.kz">
    <meta property="twitter:url" content="<?= Yii::$app->request->hostInfo ?>">
    <meta name="twitter:title" content="Шайсұлтан Шаяхметов атындағы «Тіл Қазына» ұлттық ғылыми-практикалық орталығы">
    <meta name="twitter:description" content="Til-Qazyna">
    <meta name="twitter:image" content="<?= Yii::$app->request->hostInfo ?>/NewLogo.svg">
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="" />

    <?php $this->head() ?>
</head>




<body>
    <?php $this->beginBody() ?>
    <?php
    if (Yii::$app->session->getFlash('successAnswer')) {
        echo \yii\bootstrap\Alert::widget([
            'options' => ['class' => 'alert-success'],
            'body' => Yii::$app->session->getFlash('successAnswer'),
        ]);
    } ?>
    <div class="main-wrapper">
        <?php echo $this->render('//layouts/header'); ?>
        <div class="main">

            <div class="content">
                <?php echo $content ?>
            </div>
        </div>
        <?= $this->render('//layouts/footer'); ?>
    </div>
    <script src="swiper/swiper-bundle.min.js"></script>
    <script>
    var Swipes = new Swiper('.swiper-container', {
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
        },
    });
    </script>
    <script>
      var swiper = new Swiper(".swiper-carousel-video", {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        },
      });
    </script>
    <script>
      var swiper = new Swiper(".swiper-carousel", {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 50,
          },
        },
      });
    </script>
    
    <script src="js/main.js"></script>
    <!-- Yandex.Metrika counter -->
    <script type="text/javascript" >
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(89367985, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
      });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/89367985" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika counter -->

    <?php $this->endBody() ?>
</body>

</html>
<?php $this->endPage() ?>