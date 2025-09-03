<?php
$this->title = 'Tiл Қазына - Сабақтар үлгісі';
$this->params['breadcrumbs'][] = $this->title;
?>






<div class="news-page">
    <div class="main-page__in floated">
        <div class="main-page__center">
            <div class="orta-page__in">
                <h1 class="title-b">Сабақтар үлгісі</h1>

                <div class="row">
                    <?php 
                        foreach ($art as $art) {
                    ?>
                    <div class="col-sm-4">

                        <a href="/adisart/<?php echo $art['id']?>">
                            <div class="adis-img"><img src="<?php echo $art['img']?>" alt=""></div>
                        </a>
                        <div class="card-body card-title"><a
                                href="/adisart/<?php echo $art['id']?>"><?php echo $art['title']?></a></div>
                    </div>
                    <?php 
                        }
                    ?>
                </div>

            </div>
        </div>
    </div>
</div>