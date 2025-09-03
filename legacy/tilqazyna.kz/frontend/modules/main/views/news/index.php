
<?php $this->title = 'Тіл-Қазына жаңалықтар' ?>
<div class="container">

    <?php foreach ($art as $item): ?>
        <div class="col-md-4">
            <a href="https:///tilqazyna.kz/article/<?php echo $item['id'] ?>">
                <div class="adis-img"><img src="https:///tilqazyna.kz/<?php echo $item['img'] ?>" style="width: 100%; height: 250px; object-fit: cover;" class="img-responsive"  alt="<?php echo $item['title'] ?>"
                                           alt=""></div>
            </a>
            <div class="card-body card-title"><a href="https:///tilqazyna.kz/article/<?php echo $item['id'] ?>"><?php echo $item['title'] ?></a></div>
        </div>
    <?php endforeach; ?>

    <?php
    echo \yii\widgets\LinkPager::widget([
        'pagination' => $pagination,
    ]);
    ?>
</div>
<style>
    .col-md-4 {
        padding-right: 15px!important;
        padding-left: 15px!important;
        width: 29.333333%;
        background: #fff;
        margin: 5px;
        height: 450px;
    }
</style>