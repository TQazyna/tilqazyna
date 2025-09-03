<?php
$this->title = 'Тіл Әлемі - Іздеу';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="orta-page">
    <div class="main-page__in floated">
        <div class="main-page__left">
            <div class="orta-page__in">
                <div class="orta-page__title-b">
                    <h3 class="orta-page__title">Іздеу нәтижесі</h3>
                </div>
                <p class="orta-page__text">
                    <strong style='font-weight: 700;'><?=$asd?></strong> сөзі бойынша барлығы <?=$count?> нәтиже табылды.
                </p>
                <?
                foreach ($results as $res){
                        ?>
                        <a href="<?=$res['link']?>"><h2 class="ortalyk-page__title"><?=$res['title']?></h2></a>
                        <p class="orta-page__text" style="border-bottom: 1px solid #91908f;padding-bottom:10px;">
                            <?=$res['des']?>
                        </p>
                    <?}
                ?>

            </div>
        </div>
    </div>
</div>