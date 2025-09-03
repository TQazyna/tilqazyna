<?php
$this->title = $art['title'];
$this->params['breadcrumbs'][] = $this->title;

$this->registerJsFile('/js/jRate.min.js', ['depends' => 'yii\web\JqueryAsset']);
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
                    <h2 class="news-item__title"><?= $art['title'] ?></h2>
                </div>
                <div class="news-item__views-b">
                    <span class="main-page__views">
                        <svg version="1.1" class="main-page__date-icon" viewBox="0 0 19 17" enable-background="new 0 0 19 17">
                            <path fill="#CCCCCC" d="M13.424,4.671c0.57,0,1.033-0.458,1.033-1.023V1.024C14.457,0.459,13.994,0,13.424,0s-1.032,0.459-1.032,1.024v2.623C12.392,4.213,12.854,4.671,13.424,4.671z M8.197,3.072h2.607c0.456,0,0.826-0.367,0.826-0.819s-0.37-0.819-0.826-0.819H8.197c-0.456,0-0.826,0.367-0.826,0.819S7.741,3.072,8.197,3.072z M18.174,1.434h-1.931c-0.456,0-0.826,0.367-0.826,0.819s0.37,0.819,0.826,0.819h1.104v3.482H1.652V3.072h1.105c0.456,0,0.826-0.367,0.826-0.819s-0.37-0.819-0.826-0.819H0.827C0.37,1.434,0,1.876,0,2.329v13.852C0,16.633,0.37,17,0.827,17h17.347C18.631,17,19,16.633,19,16.181V2.329C19,1.876,18.631,1.434,18.174,1.434z M17.348,15.361H1.652V7.988h15.696V15.361zM5.576,4.671c0.57,0,1.033-0.458,1.033-1.023V1.024C6.609,0.459,6.146,0,5.576,0S4.543,0.459,4.543,1.024v2.623C4.543,4.213,5.006,4.671,5.576,4.671z" />
                        </svg>
                        <?= $art['date'] ?>
                    </span>
                    <span class="main-page__views">
                        <svg version="1.1" class="main-page__views-icon" viewBox="0 0 21 12" enable-background="new 0 0 21 12">
                            <path fill="#CCCCCC" d="M11.028,2.346c-1-0.138-1.994,0.112-2.8,0.705C6.565,4.274,6.23,6.591,7.48,8.217c0.606,0.789,1.492,1.3,2.492,1.438c0.178,0.024,0.358,0.037,0.536,0.037c0.814,0,1.602-0.256,2.263-0.743c1.662-1.222,1.998-3.539,0.748-5.166C12.913,2.994,12.028,2.483,11.028,2.346z M11.946,7.885c-0.514,0.378-1.147,0.537-1.782,0.449C9.528,8.246,8.963,7.921,8.577,7.418c-0.799-1.04-0.586-2.521,0.477-3.303c0.514-0.378,1.146-0.537,1.783-0.449c0.637,0.088,1.201,0.413,1.586,0.915C13.223,5.622,13.008,7.104,11.946,7.885zM11.212,4.418c-0.243,0-0.477,0.093-0.646,0.26c-0.171,0.164-0.267,0.394-0.267,0.629c0,0.233,0.096,0.462,0.267,0.629c0.169,0.164,0.403,0.26,0.646,0.26c0.24,0,0.476-0.096,0.645-0.26c0.172-0.167,0.268-0.396,0.268-0.629c0-0.235-0.096-0.465-0.268-0.629C11.688,4.511,11.452,4.418,11.212,4.418z M20.846,5.505C20.691,5.28,16.98,0,10.5,0C4.02,0,0.309,5.28,0.154,5.505c-0.206,0.3-0.206,0.69,0,0.99C0.309,6.72,4.02,12,10.5,12c6.481,0,10.192-5.28,10.346-5.505C21.052,6.195,21.052,5.805,20.846,5.505z M10.5,10.223c-4.409,0-7.41-3.014-8.438-4.225c1.023-1.212,4.009-4.22,8.438-4.22c4.409,0,7.41,3.011,8.437,4.222C17.907,7.212,14.906,10.223,10.5,10.223z" />
                        </svg>
                        <?= $art['views'] ?>
                    </span>
                </div>
                <div class="news-item__body">

                    <div class="news-item__text">
                        <? if ($art['cat_id'] == 15) { ?>
                            <iframe width="100%" height="515" src="https://www.youtube.com/embed/<?php echo \common\components\MyLib\MyLib::getLink($art['id']); ?>" frameborder="0" allowfullscreen></iframe>
                        <? }
                        if ($art['cat_id'] == 19) { ?>
                            <iframe width="100%" height="515" src="https://www.youtube.com/embed/<?php echo \common\components\MyLib\MyLib::getLink($art['id']); ?>" frameborder="0" allowfullscreen></iframe>
                        <? }
                        if ($art['cat_id'] == 20) { ?>
                            <iframe width="100%" height="515" src="https://www.youtube.com/embed/<?php echo \common\components\MyLib\MyLib::getLink($art['id']); ?>" frameborder="0" allowfullscreen></iframe>
                        <? } elseif ($art['cat_id'] == 18) { ?>
                            <audio controls style="width:100%">
                                <source src="<?= $art['audio'] ?>" type="audio/mpeg">
                                <source src="/audios/<?= $art['prev'] ?>.mp3" type="audio/mpeg">
                                Audio не поддерживается вашим браузером.
                            </audio>
                        <? } else { ?>
                            <?= $art['text'] ?>
                        <? } ?>
                    </div>
                    <div class="news-item__tags">
                        <span class="news-item__tags__title">Тегтер:</span>
                        <span class="news-item__tag"><?= $art['conc'] ?></span>
                    </div>
                    <div class="news-item__tags">
                        <span class="news-item__tags__title">Авторы:</span>
                        <? if (!empty($art['author_link'])) { ?>
                            <a href="/users/<?= $art['author_link'] ?>">
                                <span class="news-item__tag"><?= $art['author'] ?></span>
                            </a>
                        <? } else { ?>
                            <span class="news-item__tag"><?= $art['author'] ?></span>
                        <? } ?>
                    </div>
                    <div class="review-b">

                        <div id="jRate"></div>

                        <!-- facebook comments plugin -->
                        <div id="fb-root"></div>
                        <script>
                            (function(d, s, id) {
                                var js, fjs = d.getElementsByTagName(s)[0];
                                if (d.getElementById(id)) return;
                                js = d.createElement(s);
                                js.id = id;
                                js.src = "//connect.facebook.net/kk_KZ/sdk.js#xfbml=1&version=v2.10";
                                fjs.parentNode.insertBefore(js, fjs);
                            }(document, 'script', 'facebook-jssdk'));
                        </script>
                        <div class="fb-comments" data-href="<?= yii\helpers\Url::canonical() //(Yii::$app->request->url, true);
                                                            ?>" data-width="auto" data-numposts="5"></div>
                        <!-- /facebook comments plugin -->
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>
<script>
    $(function() {
        var equal_height = 0;
        $(".row div").each(function() {
            if ($(this).height() > equal_height) {
                equal_height = $(this).height();
            }
        });
        $(".row div").height(equal_height);
    });
</script>