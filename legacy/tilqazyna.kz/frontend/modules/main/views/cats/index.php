<?php
$this->title = $title;
$this->params['breadcrumbs'][] = $this->title;
?>
<?php
$this->registerJs(
    '
    var num = 18; //чтобы знать с какой записи вытаскивать данные
    var catid = '.$cat_id.'; //чтобы знать с какой записи вытаскивать данные
    $(function() {
        $("#load").click(function(){ //Выполняем если по кнопке кликнули
            //$("#imgLoad").show(); //Показываем прелоадер
            $.ajax({
                url: "/main/cats/load",
                type: "GET",
                data: {"num": num,"catid": catid},
                cache: false,
                success: function(response){
                    if(response == 0){  // смотрим ответ от сервера и выполняем соответствующее действие

                        $("#load").hide();
                    }else{
                        $("#content").append(response);
                        num = num + 18;
                        //$("#imgLoad").hide();
                    }
                }
            });
        });
    });
    '

);
?>
<div class="row">
    <div class="large-12 medium-12  columns large-centered home">
        <div class="row">
            <div style="float:left;width: 75%;">
            <div class="container-block" id="content" style="width: 100%">
                <?
                $i=1;
                foreach ($arts as $art) {?>
                    <div class="block-3 text-center grid <?if($i%3==0){echo 'pink';}?>">
                        <div class="info">
                            <div class="img-center"><img width="100%" src="<?=$art['img']?>" alt=""></div><a href="/article/<?echo $art['id']."-".$art['preview'].".html";?>"><?=$art['title']?></a>
                            <hr>
                            <div class="info-views"><img src="../img/icons/eyes.png" alt="eyes"><span><?=$art['views']?></span><img src="../img/icons/comments.png" alt="comments"><span><?=$art['comments']?></span></div>
                        </div>
                    </div>
                    <?$i++;}?>

            </div>
                <?if($count>=18):?>
                    <div class="clearfix">
                    </div>
                    <div class="text-center">
                        <button id="load" class="button button-purple">Показать еще</button>
                    </div>
                <?endif?>
            </div>


            <div class="right-sidebar">
                <div class="block-3 text-center grid">
                    <div class="info"><?php echo \frontend\widgets\Banners::widget(["pos"=>"enter_top"]);?></div>
                </div>
                <?echo \frontend\widgets\Popular::widget();?>
            </div>

        </div>
    </div>
</div>

