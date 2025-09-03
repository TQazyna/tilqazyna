<meta charset="UTF-8">
<?php

use ckarjun\owlcarousel\OwlCarouselWidget;
use dd3v\unslider\Unslider;
use yii\bootstrap\Tabs;

$this->title = 'Шайсұлтан Шаяхметов атындағы «Тіл Қазына» ұлттық ғылыми-практикалық орталығы';

require_once('dbconnect.php');
require_once('dbquery.php');
?>

<section class="main-page slider-section">

    <div id="app"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react.min.js"></script>
    <link rel="stylesheet" href="/sliders/slides.css">
    <script src="/slides/slides.js"></script>

    <div class="swiper-container">
        <div class="swiper-wrapper">
            <?php //foreach ($result as $result) { 
            ?>
            <div class="swiper-slide">
                <div class="swiper-slide">
                    <div class="swiper-container main-swiper-container swiper-initialized swiper-horizontal swiper-pointer-events">
                        <div class="slider__item">
                            <img src="/slider/000001.jpg" alt="Тіл-Қазына» КеАҚ" class="slider__image-src">
                        </div>
                    </div>
                </div>
            </div>
            <div class="swiper-slide">
                <div class="swiper-slide">
                    <div class="swiper-container main-swiper-container swiper-initialized swiper-horizontal swiper-pointer-events">
                        <div class="slider__item">
                            <img src="/slider/000002.jpg" alt="Тіл-Қазына» КеАҚ" class="slider__image-src">
                        </div>
                    </div>
                </div>
            </div>
            <div class="swiper-slide">
                <div class="swiper-slide">
                    <div class="swiper-container main-swiper-container swiper-initialized swiper-horizontal swiper-pointer-events">
                        <div class="slider__item">
                            <img src="/slider/000003.jpg" alt="Тіл-Қазына» КеАҚ" class="slider__image-src">
                        </div>
                    </div>
                </div>
            </div>
            <?php //} 
            ?>
        </div>
        <!-- !swiper slides -->

        <!-- next / prev arrows -->
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
        <!-- !next / prev arrows -->

        <!-- pagination dots -->
        <!-- <div class="swiper-pagination"></div> -->
        <!-- !pagination dots -->
    </div>
</section>
<section class="container news-section">
    <div class="content">
        <div class="col-md-12 bgwhite">
            <!-- col-md-19  -->
            <div>
                <?php
                $sql = "SELECT id, title, img, date FROM articles WHERE `cat_id` <= '17' AND `online` >= '1' ORDER BY id DESC LIMIT 4";
                $result = $conn->query($sql);
                ?>
                <div id="news" class="news">
                    <div class="strike h-title"><span>
                            <h3>Жаңалықтар</h3>
                        </span></div>
                    <!-- <div class="card-deck news-box evgd-news-main">
                        <?php if ($result->num_rows > 0) {
                            while ($row = $result->fetch_assoc()) { ?>
                                <div class="card evgd-news-card">
                                    <a href="//tilalemi.kz/article/<?php echo $row['id'] ?>" class="card-link">
                                        <img src="//tilalemi.kz/<?php print_r($row['img']) ?>" alt="<?php echo $row['title'] ?>" class="card-img-top">
                                    </a>
                                    <div class="card-body">
                                        <a href="//tilalemi.kz/article/<?php echo $row['id'] ?>" class="card-link">
                                            <p class="card-title"><?php echo $row['title'] ?></p>
                                        </a>
                                    </div>
                                    <div class="card-footer bg-transparent">
                                        <a href="//tilalemi.kz/article/<?php echo $row['id'] ?>" class="card-link">Толығырақ
                                            <img src="/img/arrow-right.svg" alt=""></a>
                                        <span class="date-news"><?= Yii::$app->formatter->asDate($row['date'], 'php:F Y') ?></span>
                                    </div>
                                </div>
                        <?php }
                        }
                        $conn->close(); ?>
                    </div>
                    <a href="//tilalemi.kz/news" class="all-news"><img src="/padnote.png" alt="...">Барлық
                        жаңалықтар</a> -->
                </div>
            </div>
        </div>
        <!-- <div class="col-md-3 bgwhite">
            <div class="news director-blog">
                <div class="strike h-title"><span>
                        <h3>Директор блогы</h3>
                    </span></div>
                <div class="card-deck news-box evgd-news-main">
                    <div class="card evgd-news-card">
                        <a href="" class="card-link">
                            <img src="/img/director.jpg" alt="Генеральный директор" class="director-card-img">
                        </a>
                        <div class="card-body">
                            <a href="" class="card-link">
                                <h5 class="card-title"></h5>
                            </a>
                        </div>
                        <div class="card-footer bg-transparent center">
                            <span>Бас директор</span><br>
                            <span>Тілешов Ербол Ердембекұлы</span>
                        </div>
                        <a href="/blogs" class="director-message"><img src="/padnote.png" alt="...">Сұрақ қою</a>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</section>
<!-- <section class="project-container">
    <div class="container" style="min-height: 500px;">
        <div class="strike h-title margin20 paddingtop20 paddingbottom20">
            <span>
                <h3>Біздің жобалар</h3>
            </span>
        </div>
        <div class="">
            <div class="colmd3"><a href="//tilalemi.kz"><img src="/img/onimder/Tilalemi.jpg" alt=""></a></div>
            <div class="colmd3"><a href="//termincom.kz"><img src="/img/onimder/Termincom.jpg" alt=""></a></div>
            <div class="colmd3"><a href="//tilqural.kz"><img src="/img/onimder/tilqural.jpg" alt=""></a></div>
            <div class="colmd3"><a href="//qazcorpora.kz"><img src="/img/onimder/qazcorpora.jpg" alt=""></a></div>
            <div class="colmd3"><a href="//abai.institute"><img src="/img/onimder/abai.institute.jpg" alt=""></a></div>
            <div class="colmd3"><a href="//sozdikqor.kz"><img src="/img/onimder/Sozdikqor.jpg" alt=""></a></div>
            <div class="colmd3"><a href="http://balatili.kz"><img src="/img/onimder/Balatili.jpg" alt=""></a></div>
            <div class="colmd3"><a href="//emle.kz"><img src="/img/onimder/Emle.jpg" alt=""></a></div>
            <div class="colmd3"><a href="//qazlatyn.kz"><img src="/img/onimder/Qazlatyn.jpg" alt=""></a></div>
            <div class="colmd3"><a href="//qujat.kz"><img src="/img/onimder/Qujat.jpg" alt=""></a></div>
            <div class="colmd3"><a href="//tilmedia.kz"><img src="/img/onimder/Tilmedia.jpg" alt=""></a></div>
            <div class="colmd3"><a href="//atau.kz"><img src="/img/onimder/Atau.jpg" alt=""></a></div>
        </div>
    </div>
</section> -->
<section class="Youtube-container">
    <div class="container" style="min-height: 300px; width:1291px;min-height:333px;">
        <div class="strike h-title margin20">
            <span>
                <h3>Youtube</h3>
            </span>
        </div>
        <div class="swiper swiper-carousel-video">
            <div class="swiper-wrapper">
                <div class="swiper-slide"><iframe width="370" height="215" src="https://www.youtube.com/embed/2GULoyhaPtE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                <div class="swiper-slide"><iframe width="370" height="215" src="https://www.youtube.com/embed/17dEoUBq3KA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                <div class="swiper-slide"><iframe width="370" height="215" src="https://www.youtube.com/embed/Vb5XphdK8Gc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
    </div>
</section>
<section class="carousel-container">
    <div class="container" style="width:1291px;min-height: 300px;">
        <div class="strike h-title margin20">
            <span>
                <h3>Серіктестер</h3>
            </span>
        </div>
        <div class="swiper swiper-carousel">
            <div class="swiper-wrapper">
                <div class="swiper-slide"><img src="/img/carousel/Администрация Президента РК.jpg" alt=""></div>
                <div class="swiper-slide"><img src="/img/carousel/Ғылым және жоғары білім министрлігі.png" alt=""></div>
                <div class="swiper-slide"><img src="/img/carousel/МинКультруры.jpg" alt=""></div>
                <div class="swiper-slide"><img src="/img/carousel/ТілКомитет.png" alt=""></div>
                <div class="swiper-slide"><img src="/img/carousel/ТБІ.png" alt=""></div>
                <div class="swiper-slide"><img src="/img/carousel/AltynsarinAkademiasy.png" alt=""></div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
    </div>
</section>
<section class="contact-container">
    <div class="container"></div>
</section>