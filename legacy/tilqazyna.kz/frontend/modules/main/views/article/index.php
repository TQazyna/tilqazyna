<?php
$this->title = $art['title'];
$this->params['breadcrumbs'][] = $this->title;

$this->registerJsFile('/js/jRate.min.js', ['depends'=>'yii\web\JqueryAsset']);
$this->registerJs("
	var canRate = true;
	var lastRating = {$art['rating']};
	var toolitup = $('#jRate').jRate({
		startColor: '#FCE5D0',
		endColor: '#ef7a00',
		width: 20,
		height: 20,
		rating: {$art['rating']},
		strokeColor: 'black',
		precision: 1,
		minSelected: 1,
		onChange: function(rating) {
			//console.log('OnChange: Rating: '+rating);
		},
		onSet: function(rating) {
			//console.log('OnSet: Rating: '+rating);
			if (canRate) {
				canRate = false;
				$.post('/ajax/rate', {rate:rating, table:'articles', id: {$art['id']} }, function(data) {
					lastRating = data;
					toolitup.setRating(data);
				});
			} else {
				toolitup.setRating(lastRating);
			}
		}
	});
");

?>
<div class="news-page">
    <div class="news-page__in floated">
        <div class="main-page__left">
            <div class="news-item">
                <div class="news-item__title-b">
                    <h2 class="news-item__title"><?=$art['title']?></h2>
                </div>
                <div class="news-item__views-b">
                </div>
                <div class="news-item__body">
                    <img src="<?php echo $art['img']?>" alt="<?php echo $art['title'] ?>" style="display: block; margin: 0 auto; max-width: 80%;">

                    <div class="news-item__text">
                        <? if($art['cat_id']==15){ ?>
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/<?php echo \common\components\MyLib\MyLib::getLink($art['id']);?>" frameborder="0" allowfullscreen></iframe>
                        <?}elseif($art['cat_id']==18){?>
                            <audio controls>
                                <source src="/audios/<?=$art['prev']?>.mp3" type="audio/mpeg">
                                <source src="/audios/<?=$art['prev']?>.mp3" type="audio/mpeg">
                                Тег audio не поддерживается вашим браузером.
                            </audio>
                        <?}else{?>
                            <?=$art['text']?>
                        <?}?>
                    </div>

                </div>

            </div>

        </div>
    </div>
</div>

