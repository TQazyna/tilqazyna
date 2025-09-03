<!-- traur -->
<!-- <style>
    body {filter: grayscale(100%);}
    .mourning {
    display: block;
    padding: 11px 50px;
    background: #000;
    color: #fff;
    text-align: center;
    text-transform: uppercase;
    text-decoration: none;
    width: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    left: 0;
}
</style>
<div class="bottom-layer">
                    <a href="https://massaget.kz/basty-zhaalytar-438/93374/" class="mourning">
                        2023 жыл 29 қазан – Қазақстан Республикасы Жалпыұлттық аза тұту күні
                    </a>
                </div>
<div> -->
<!-- traur -->
<?php

use yii\bootstrap\Tabs; ?>

<header class="header">
    <div class="header__top floated">
        <div class="header_top_b">
            <div class="header__logo">
                <a href="/" class="">
                    <img src="/NewLogo.svg" width="150">
                </a>
            </div>
            <nav>
                <nav class="header__menu">
                    <div class="header__menu-item">
                        <a href="//tilqazyna.kz">
                            <span class="header__menu-item-text">Басты бет</span>
                        </a>
                    </div>
                    <div class="header__menu-item">
                        <span class="header__menu-item-text">Біз туралы</span>
                        <div class="header__menu-dropdown">
                            <a href="/blogs">
                                <span class="header__menu-dropdown-item">Бас директор блогы</span>
                            </a>
                            <a href="/directors">
                                <span class="header__menu-dropdown-item">Директорлар кеңесі</span>
                            </a>
                            <a href="/structure">
                                <span class="header__menu-dropdown-item">Құрылым</span>
                            </a>
                            <a href="/departments">
                                <span class="header__menu-dropdown-item">Бөлімдер</span>
                            </a>
                            <a href="/about">
                                <span class="header__menu-dropdown-item">Байланыс</span>
                            </a>
                        </div>
                    </div>
                    <div class="header__menu-item">
                        <a href="/news">
                            <span class="header__menu-item-text">Жаңалықтар</span>
                        </a>
                    </div>
                    <div class="header__menu-item">
                        <span class="header__menu-item-text">Негізі құжаттар</span>
                        <div class="header__menu-dropdown">
                            <a href="//adilet.zan.kz/kaz/docs/K950001000_">
                                <span class="header__menu-dropdown-item">Қазақстан Республикасының Конституциясы</span>
                            </a>
                            <a href="https://adilet.zan.kz/kaz/docs/Z970000151_">
                                <span class="header__menu-dropdown-item">Қазақстан Республикасындағы Тіл туралы
                                    заң</span>
                            </a>
                            <a href="https://adilet.zan.kz/kaz/docs/P1900001045">
                                <span class="header__menu-dropdown-item">Қазақстан Республикасындағы тіл саясатын іске
                                    асырудың 2020-2025 жылдарға арналған мемлекеттік бағдарламасы</span>
                            </a>
                            <a href="/">
                                <span class="header__menu-dropdown-item">Қоғамның жарғысы</span>
                            </a>
                        </div>
                    </div>
                    <!-- <div class="header__menu-item">
                        <a href="/"><span class="header__menu-item-text">БАҚ және тіл</span> </a>
                        <div class="header__menu-dropdown">
                            <a href="/">
                                <span class="header__menu-dropdown-item">Пресс-релиз</span>
                            </a>
                            <a href="/links">
                                <span class="header__menu-dropdown-item">Жарияланымдардың сілтемесі</span>
                            </a>
                        </div> 
                    </div>-->


                    <a href="javascript:void(0)" class="header__letter js-overlay-link floated">
                        <span class="header__menu-item">Орталықтар</span>
                    </a>
                    <div class="overlay js-overlay-b">
                        <div class="header__enter-c__overlay js-overlay-form">
                            <?php echo Tabs::widget([
                                'items' => [
                                    ['label' => 'Астана қаласы', 'content' => $this->render('/ortalyk/nursultan'), 'active' => true],
                                    ['label' => 'Алматы қаласы', 'content' => $this->render('/ortalyk/almaty'),],
                                    ['label' => 'Шымкент қаласы', 'content' => $this->render('/ortalyk/shymkent'),],
                                    ['label' => 'Ақмола облысы', 'content' => $this->render('/ortalyk/aqmola'),],
                                    ['label' => 'Ақтөбе облысы', 'content' => $this->render('/ortalyk/aqtobe'),],
                                    ['label' => 'Алматы облысы', 'content' => $this->render('/ortalyk/almatyobl'),],
                                    ['label' => 'Атырау облысы', 'content' => $this->render('/ortalyk/atyrau'),],
                                    ['label' => 'Батыс Қазақстан облысы', 'content' => $this->render('/ortalyk/batys'),],
                                    ['label' => 'Жамбыл облысы', 'content' => $this->render('/ortalyk/jambil'),],
                                    ['label' => 'Қарағанды облысы', 'content' => $this->render('/ortalyk/qaraganda'),],
                                    ['label' => 'Қостанай облысы', 'content' => $this->render('/ortalyk/qostanay'),],
                                    ['label' => 'Қызылорда облысы', 'content' => $this->render('/ortalyk/qyzylorda'),],
                                    ['label' => 'Манғыстау облысы', 'content' => $this->render('/ortalyk/mangystau'),],
                                    ['label' => 'Түркістан облысы', 'content' => $this->render('/ortalyk/turkestan'),],
                                    ['label' => 'Павлодар облысы', 'content' => $this->render('/ortalyk/pavlodar'),],
                                    ['label' => 'Солтүстік Қазақстан облысы', 'content' => $this->render('/ortalyk/soltystik'),],
                                    ['label' => 'Шығыс Қазақстан облысы', 'content' => $this->render('/ortalyk/shygys'),],
                                ]
                            ]);
                            ?>
                        </div>
                    </div>
                    <div class="header__menu-item">
                        <a href="/data"><span class="header__menu-item-text">Мамандар базасы</span></a>
                    </div>
                    <div class="header__menu-item">
                        <a href="/announcements"><span class="header__menu-item-text">Хабарландырулар</span></a>
                    </div>
                    <div class="header__menu-item" style="width: 50px;">
                        <a href="/send"><span class="header__menu-item-text">
                                <svg class="header__search__icon" version="1.1" xmlns="//www.w3.org/2000/svg"
                                    xmlns:xlink="//www.w3.org/1999/xlink" viewBox="0 0 19 19"
                                    enable-background="new 0 0 19 19" xml:space="preserve">
                                    <path fill-rule="evenodd" clip-rule="evenodd" fill="#ccc"
                                        d="M18.646,16.975l-3.571-3.575c-0.032-0.032-0.073-0.045-0.108-0.073c1.057-1.395,1.69-3.125,1.69-5.009c0-4.595-3.729-8.319-8.329-8.319C3.728-0.002,0,3.723,0,8.317s3.729,8.319,8.329,8.319c1.889,0,3.625-0.636,5.021-1.693c0.029,0.035,0.042,0.078,0.075,0.111l3.572,3.574c0.47,0.473,1.222,0.484,1.677,0.027C19.13,18.199,19.117,17.446,18.646,16.975z M8.31,14.232c-3.281,0-5.94-2.656-5.94-5.933c0-3.277,2.66-5.934,5.94-5.934c3.28,0,5.94,2.656,5.94,5.934C14.25,11.576,11.59,14.232,8.31,14.232z" />
                                </svg></span></a>
                    </div>
                    <!-- <div class="header__search-b">
                        <?php $form = \yii\widgets\ActiveForm::begin(['action' => '/', 'method' => 'get']) //$form = \yii\widgets\ActiveForm::begin(['action' => '/search', 'method' => 'get'])
                        ?>
                        <div class="header__search floated">
                            <input type="search" name="search" class="header__search__input"
                                placeholder="портал бойынша іздеу">
                            <button type="submit" class="header__search__button">
                                <svg class="header__search__icon" version="1.1" xmlns="//www.w3.org/2000/svg"
                                    xmlns:xlink="//www.w3.org/1999/xlink" viewBox="0 0 19 19"
                                    enable-background="new 0 0 19 19" xml:space="preserve">
                                    <path fill-rule="evenodd" clip-rule="evenodd" fill="#ccc"
                                        d="M18.646,16.975l-3.571-3.575c-0.032-0.032-0.073-0.045-0.108-0.073c1.057-1.395,1.69-3.125,1.69-5.009c0-4.595-3.729-8.319-8.329-8.319C3.728-0.002,0,3.723,0,8.317s3.729,8.319,8.329,8.319c1.889,0,3.625-0.636,5.021-1.693c0.029,0.035,0.042,0.078,0.075,0.111l3.572,3.574c0.47,0.473,1.222,0.484,1.677,0.027C19.13,18.199,19.117,17.446,18.646,16.975z M8.31,14.232c-3.281,0-5.94-2.656-5.94-5.933c0-3.277,2.66-5.934,5.94-5.934c3.28,0,5.94,2.656,5.94,5.934C14.25,11.576,11.59,14.232,8.31,14.232z" />
                                </svg>
                            </button>
                        </div>
                        <?php \yii\widgets\ActiveForm::end(); ?>
                    </div> -->
                </nav>

            </nav>

            <!-- mobile -->
            <nav class="mobilescreen">
                <div title="Menu" id="menuToggle">
                    <input class="close" type="checkbox">
                    <span></span>
                    <span></span>
                    <span></span>
                    <ul id="menu">
                        <li>
                            <a href="#">Біз туралы</a>
                        </li>
                        <li>
                            <a href="/blogs">Бас директор блогы</a>
                        </li>
                        <li>
                            <a href="/directors">Директорлар кеңесі</a>
                        </li>
                        <li>
                            <a href="/structure">Құрылым</a>
                        </li>
                        <li>
                            <a href="/departments">Басқармалар</a>
                        </li>
                        <li>
                            <a href="/about">Байланыс</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <!-- endmobile -->
        </div>

    </div>
</header>