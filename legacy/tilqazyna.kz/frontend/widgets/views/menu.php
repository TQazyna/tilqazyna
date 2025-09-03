<div id="happyme" class="top-bar">
    <div class="top-bar-left">
        <ul data-responsive-menu="drilldown medium-dropdown" class="menu vertical medium-horizontal">
            <a href="/"><li class="menu-text"> <img src="/img/logo2.png" alt="logo"></li></a>
        </ul>
    </div>
    <div class="top-bar-section text-center">
        <ul class="center">
            <li class="home-link"><a href="/">Главная</a></li>
            <? foreach ($cats as $cat) {?>
                <li><a href="/<?=$cat['alias']?>"><?=$cat['title']?></a></li>
            <?}?>
        </ul>
    </div>
    <div class="top-bar-right">
        <ul data-responsive-menu="drilldown medium-dropdown" class="menu vertical medium-horizontal">


                <?php
                if (Yii::$app->user->isGuest) {?>
            <li>
                    <button data-open="sign" class="button radius">Войти</button>
            </li>
                <?} else {?>
                    <li>
                    <a href="/profile"><?echo Yii::$app->user->identity->username;?></a>
                    </li>
                    <li>
                    <a href="/main/main/logout">Выйти</a>
                    </li>
                <?}
                ?>


            <!--<li><a href="#" data-open="sign-up">Регистрация</a></li>-->
        </ul>
    </div>
</div>