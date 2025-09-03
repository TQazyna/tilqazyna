<?php
$this->title = 'Тіл Әлемі - Біз туралы';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="orta-page">
    <div class="main-page__in floated">
        <div class="main-page__left">
            <div class="orta-page__in">
            <h3 class="orta-page__title">Қоғамның мақсаты, міндеттері</h3>
            <?php
                foreach ($art as $art) {
                    ?>
                <div class="orta-page__title-b">
                    
                </div>
                <p class="orta-page__text">
                    <h2> <?php echo $art['title']?></h2>
               <?php echo $art['text']; ?>
                </p>

            
                </div>


            </div>
            <?php } ?>

        </div>
    </div>
</div>
