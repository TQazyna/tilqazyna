<?php
$this->title = 'Тіл Әлемі - Мемлекеттік тіл және БАҚ';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="til-page">
    <div class="breadcrumb-b">
        <span class="breadcrumb">Тұғыр   /   Мемлекеттік тіл және БАҚ</span>
    </div>

    <div class="main-page__item__title-b main-page__item__title-b--page floated">
        <h3 class="main-page__item__title"><?=$title?></h3>
        <div class="main-page__item__title__tags">
            <? foreach ($uzdiks as $uzdik) {?>
                <a href="/memtil/<?=$uzdik['id']?>"><span class="main-page__item__title__tag"><?=$uzdik['title']?></span></a>
            <?} ?>

        </div>
    </div>

    <?
    $i = 0;
    foreach ($Uzdiks as $Uzdik) {

        ?>
    <? if($i == $uzdik['id']){?>
        </div>
    </div>
    <div class="main-page__tartu-b">
        <div class="main-page__tartu__items floated">
            <?} ?>
            <div class="main-page__tartu">
                <div class="main-page__tartu__img-b">
                    <img src="<?=$uzdik['img']?>" class="main-page__tartu__img"/>
                    <div class="main-page__tartu__link-b js-tartu-link">
                        <a href="/program1/one/<?=$uzdik['id']?>" class="main-page__tartu__link js-tartu-b">Оқу</a>
                    </div>
                </div>
                <a href="" class="main-page__tartu__section"><?=$uzdik['title']?></a>
                <div class="main-page__tartu__author"><?=$uzdik['author']?></div>
            </div>


    <?
    $i++;
    }?>


</div>