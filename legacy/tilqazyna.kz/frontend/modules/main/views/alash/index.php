<?php
$this->title = 'Тіл Әлемі - Мемлекеттік тіл және БАҚ';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="news-page">
    <div class="news-page__in floated">
        <div class="main-page__left">
            <div class="breadcrumb-b">
                <span class="breadcrumb">Тұғыр   /   Алашорда 100 жыл</span>
            </div>

    <div class="main-page__item__title-b main-page__item__title-b--page floated">
        <h3 class="main-page__item__title">Алашорда 100 жыл</h3>
 
    </div>
            <div class="main-page__news-b floated">
                <? foreach ($arts as $art) {?>
                <div class="main-page__news">
                    <div class="main-page__news__img-b">
                        <img src="<?=$art['img']?>" class="main-page__news__img"/>
                        <div class="main-page__views-b js-views-b">
                                                        <span class="main-page__views">
                                                             <svg version="1.1" class="main-page__views-icon" viewBox="0 0 21 12" enable-background="new 0 0 21 12">
                                                                 <path fill="#CCCCCC" d="M11.028,2.346c-1-0.138-1.994,0.112-2.8,0.705C6.565,4.274,6.23,6.591,7.48,8.217c0.606,0.789,1.492,1.3,2.492,1.438c0.178,0.024,0.358,0.037,0.536,0.037c0.814,0,1.602-0.256,2.263-0.743c1.662-1.222,1.998-3.539,0.748-5.166C12.913,2.994,12.028,2.483,11.028,2.346z M11.946,7.885c-0.514,0.378-1.147,0.537-1.782,0.449C9.528,8.246,8.963,7.921,8.577,7.418c-0.799-1.04-0.586-2.521,0.477-3.303c0.514-0.378,1.146-0.537,1.783-0.449c0.637,0.088,1.201,0.413,1.586,0.915C13.223,5.622,13.008,7.104,11.946,7.885zM11.212,4.418c-0.243,0-0.477,0.093-0.646,0.26c-0.171,0.164-0.267,0.394-0.267,0.629c0,0.233,0.096,0.462,0.267,0.629c0.169,0.164,0.403,0.26,0.646,0.26c0.24,0,0.476-0.096,0.645-0.26c0.172-0.167,0.268-0.396,0.268-0.629c0-0.235-0.096-0.465-0.268-0.629C11.688,4.511,11.452,4.418,11.212,4.418z M20.846,5.505C20.691,5.28,16.98,0,10.5,0C4.02,0,0.309,5.28,0.154,5.505c-0.206,0.3-0.206,0.69,0,0.99C0.309,6.72,4.02,12,10.5,12c6.481,0,10.192-5.28,10.346-5.505C21.052,6.195,21.052,5.805,20.846,5.505z M10.5,10.223c-4.409,0-7.41-3.014-8.438-4.225c1.023-1.212,4.009-4.22,8.438-4.22c4.409,0,7.41,3.011,8.437,4.222C17.907,7.212,14.906,10.223,10.5,10.223z"/>
                                                             </svg>
                                                            <?=$art['views']?>
                                                        </span>
                                                           <span class="main-page__views">
                                                             <svg version="1.1" class="main-page__message-icon" viewBox="0 0 14 13" enable-background="new 0 0 14 13">
                                                                 <path fill="#FFFFFF" d="M9.947,4.264c0.16,0,0.316-0.069,0.432-0.191c0.111-0.12,0.178-0.288,0.178-0.458c0-0.171-0.066-0.34-0.178-0.46c-0.113-0.122-0.27-0.19-0.432-0.19c-0.16,0-0.316,0.068-0.43,0.19c-0.113,0.12-0.179,0.287-0.179,0.46c0,0.17,0.065,0.338,0.179,0.458C9.631,4.194,9.787,4.264,9.947,4.264z M3.445,4.225h4.407c0.336,0,0.609-0.291,0.609-0.649c0-0.359-0.273-0.65-0.609-0.65H3.445c-0.336,0-0.608,0.291-0.608,0.65C2.836,3.934,3.109,4.225,3.445,4.225z M13.392,0H0.609C0.272,0,0,0.291,0,0.65v8.298c0,0.359,0.272,0.64,0.609,0.64h7.152v2.762c0,0.273,0.192,0.517,0.433,0.61C8.262,12.987,8.35,13,8.42,13c0.175,0,0.354-0.087,0.473-0.235l2.525-3.177h1.974c0.336,0,0.608-0.28,0.608-0.64V0.65C14,0.291,13.728,0,13.392,0z M12.783,8.287h-1.647c-0.179,0-0.382,0.09-0.497,0.235l-1.66,2.056v-1.63c0-0.358-0.206-0.661-0.543-0.661H1.217V1.3h11.566V8.287z"/>
                                                             </svg>
                                                               <?=$art['comments']?>
                                                        </span>
                        </div>
                        <a href="/article/<?echo $art['id']."-".$art['preview'].".html";?>" class="main-page__news__link js-views-link"></a>

                    </div>
                    <div class="main-page__news__body">
                        <h2 class="main-page__news__section"><? if($art['cat_id']==11 and !empty($art['cat'])){echo $art['cat'];}else{ echo \common\components\MyLib\MyLib::getCatName($art['cat_id']);} ?></h2>
                        <a href="/article/<?echo $art['id']."-".$art['preview'].".html";?>">
                            <h3 class="main-page__news__title"><?=$art['title']?></h3>
                        </a>
                        <p class="main-page__news__text"><?php echo \common\models\Articles::preview($art['text']);?>...</p>
                    </div>
                </div>
                <?}?>
                <div class="main-page__news-pagination">
                </div>
            </div>

            <div class="pagination-b">
                <!--<ul class="pagination">
                    <li class="pagination__item pagination__item--first">
                        <a href="" class="pagination__link pagination__link--arrow">
                            <svg version="1.1" class="pagination__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 16" enable-background="new 0 0 20 16">
                                <path d="M19,7H3.414l5.293-5.293c0.39-0.391,0.391-1.023,0-1.414C8.512,0.098,8.256,0,8,0C7.744,0,7.488,0.098,7.292,0.293l-7,7c-0.39,0.39-0.39,1.023,0,1.414l7,7c0.391,0.391,1.024,0.391,1.415,0c0.39-0.391,0.391-1.023,0-1.414L3.414,9H19c0.552,0,1-0.448,1-1S19.552,7,19,7z"/>
                            </svg>
                        </a>
                    </li>

                    <li class="pagination__item">
                        <a href="" class="pagination__link pagination__link__active">1</a>
                    </li>
                    <li class="pagination__item">
                        <a href="" class="pagination__link">2</a>
                    </li>
                    <li class="pagination__item">
                        <a href="" class="pagination__link">3</a>
                    </li>
                    <li class="pagination__item">
                        <a href="" class="pagination__link">4</a>
                    </li>
                    <li class="pagination__item">
                        <a href="" class="pagination__link">5</a>
                    </li>
                    <li class="pagination__item">
                        <a href="" class="pagination__link">...</a>
                    </li>
                    <li class="pagination__item">
                        <a href="" class="pagination__link">74</a>
                    </li>

                    <li class="pagination__item pagination__item--last">
                        <a href="" class="pagination__link pagination__link--arrow">
                            <svg version="1.1" class="pagination__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 16" enable-background="new 0 0 20 16">
                                <path d="M0.999,9h15.587l-5.293,5.293c-0.391,0.391-0.391,1.023,0,1.414C11.488,15.902,11.744,16,12,16s0.512-0.098,0.707-0.293l7-7c0.391-0.39,0.391-1.023,0-1.414l-7-7c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414L16.586,7H0.999c-0.551,0-1,0.448-1,1S0.448,9,0.999,9z"/>
                            </svg>
                        </a>
                    </li>
                </ul>-->
            </div>
        </div>
        <div class="sidebar">
            <?php echo \frontend\widgets\More::widget();?>
            <?php echo \frontend\widgets\Popular::widget();?>

        </div>
    </div>
</div>


