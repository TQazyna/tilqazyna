<?php
$this->title = 'Тіл Әлемі - Орталықтар';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="orta-page">
    <div class="main-page__in floated">
        <div class="main-page__left">
            <div class="orta-page__in">
                <h3 class="news__title">
                    <?php
                        switch ($obl){
                            case 1:
                                echo "Ақмола облысы";
                                break;
                            case 2:
                                echo "Ақтөбе облысы";
                                break;
                            case 3:
                                echo "Астана қаласы";
                                break;
                            case 4:
                                echo "Алматы облысы";
                                break;
                            case 5:
                                echo "Алматы қаласы";
                                break;
                            case 6:
                                echo "Атырау облысы";
                                break;
                            case 7:
                                echo "Батыс Қазақстан облысы";
                                break;
                            case 8:
                                echo "Жамбыл облысы";
                                break;
                            case 9:
                                echo "Қарағанды облысы";
                                break;
                            case 10:
                                echo "Қостанай облысы";
                                break;
                            case 11:
                                echo "Қызылорда облысы";
                                break;
                            case 12:
                                echo "Оңтүстік Қазақстан облысы";
                                break;
                            case 13:
                                echo "Маңғыстау облысы";
                                break;
                            case 14:
                                echo "Павлодар облысы";
                                break;
                            case 15:
                                echo "Солтүстік Қазақстан облысы";
                                break;
                            case 16:
                                echo "Шығыс Қазақстан облысы";
                                break;

                        }
                    ?>

                </h3>
                <div class="orta-page__title-b">
                    <h3 class="orta-page__title">Басқарма</h3>
                </div>
                <?
                    foreach ($ortalyks as $orta){
                    if($orta['type']==1){
                    ?>
                        <h1 class="ortalyk-page__title"><?=$orta['title']?></h1>
                        <div class="ortalyk-page__text-b">
                            <div class="ortalyk-page__info-b">
                                <? if(!empty($orta['adres'])){?>
                                    <div class="ortalyk-page__info">
                                        <b>Мекенжайымыз:</b> <?=$orta['adres']?>
                                    </div>
                                <?} ?>
                                <? if(!empty($orta['tel'])){?>
                                    <div class="ortalyk-page__info">
                                        <b>Байланыс телефоны:</b> <?=$orta['tel']?>
                                    </div>
                                <?} ?>
                                <? if(!empty($orta['tel2'])){?>
                                    <div class="ortalyk-page__info">
                                        <b>Ұялы телефон:</b> <?=$orta['tel2']?>
                                    </div>
                                <?} ?>
                                <? if(!empty($orta['fax'])){?>
                                    <div class="ortalyk-page__info">
                                        <b>Факс:</b> <?=$orta['fax']?>
                                    </div>
                                <?} ?>
                                <? if(!empty($orta['email'])){?>
                                    <div class="ortalyk-page__info">
                                        <b>Email:</b> <?=$orta['email']?>
                                    </div>
                                <?} ?>
                                <? if(!empty($orta['site'])){?>
                                    <div class="ortalyk-page__info">
                                        <b>Сайт:</b> <a href="<?=$orta['site']?>" target="_blank"><?=$orta['site']?></a>
                                    </div>
                                <?} ?>

                            </div>
                        </div>
                    <?}}
                ?>

                <div class="orta-page__title-b">
                    <h3 class="orta-page__title">Орталықтар</h3>
                </div>
                <?
                foreach ($ortalyks as $orta){
                    if($orta['type']==2){
                        ?>
                        <h1 class="ortalyk-page__title"><?=$orta['title']?></h1>
                        <div class="ortalyk-page__text-b">
                            <div class="ortalyk-page__info-b">
                                <? if(!empty($orta['direktor'])){?>
                                    <div class="ortalyk-page__info">
                                        <b>Директоры:</b> <?=$orta['direktor']?>
                                    </div>
                                <?} ?>
                                <? if(!empty($orta['adres'])){?>
                                    <div class="ortalyk-page__info">
                                        <b>Мекенжайымыз:</b> <?=$orta['adres']?>
                                    </div>
                                <?} ?>
                                <? if(!empty($orta['tel'])){?>
                                    <div class="ortalyk-page__info">
                                        <b>Байланыс телефоны:</b> <?=$orta['tel']?>
                                    </div>
                                <?} ?>
                                <? if(!empty($orta['tel2'])){?>
                                    <div class="ortalyk-page__info">
                                        <b>Ұялы телефон:</b> <?=$orta['tel2']?>
                                    </div>
                                <?} ?>
                                <? if(!empty($orta['fax'])){?>
                                    <div class="ortalyk-page__info">
                                        <b>Факс:</b> <?=$orta['fax']?>
                                    </div>
                                <?} ?>
                                <? if(!empty($orta['email'])){?>
                                    <div class="ortalyk-page__info">
                                        <b>Email:</b> <?=$orta['email']?>
                                    </div>
                                <?} ?>
                                <? if(!empty($orta['site'])){?>
                                    <div class="ortalyk-page__info">
                                        <b>Сайт:</b> <a href="<?=$orta['site']?>" target="_blank"><?=$orta['site']?></a>
                                    </div>
                                <?} ?>

                            </div>
                        </div>
                    <?}}
                ?>
            </div>
        </div>
        <div class="sidebar">
            <div class="main-page__title-b">
                <h3 class="sidebar__title">
                    Облыстар
                </h3>
            </div>
            <div class="sidebar__orta">
                <a href="/orta/1" class="sidebar__orta-link">Ақмола облысы</a>
                <a href="/orta/2" class="sidebar__orta-link">Ақтөбе облысы</a>
                <a href="/orta/3" class="sidebar__orta-link">Астана қаласы</a>
                <a href="/orta/4" class="sidebar__orta-link">Алматы облысы</a>
                <a href="/orta/5" class="sidebar__orta-link">Алматы қаласы</a>
                <a href="/orta/6" class="sidebar__orta-link">Атырау облысы</a>
                <a href="/orta/7" class="sidebar__orta-link">Батыс Қазақстан облысы</a>
                <a href="/orta/8" class="sidebar__orta-link">Жамбыл облысы</a>
                <a href="/orta/9" class="sidebar__orta-link">Қарағанды облысы</a>
                <a href="/orta/10" class="sidebar__orta-link">Қостанай облысы</a>
                <a href="/orta/11" class="sidebar__orta-link">Қызылорда облысы</a>
                <a href="/orta/12" class="sidebar__orta-link">Оңтүстік Қазақстан облысы</a>
                <a href="/orta/13" class="sidebar__orta-link">Маңғыстау облысы</a>
                <a href="/orta/14" class="sidebar__orta-link">Павлодар облысы</a>
                <a href="/orta/15" class="sidebar__orta-link">Солтүстік Қазақстан облысы</a>
                <a href="/orta/16" class="sidebar__orta-link">Шығыс Қазақстан облысы</a>

            </div>
            <?php echo \frontend\widgets\Popular::widget();?>
        </div>
    </div>
</div>
