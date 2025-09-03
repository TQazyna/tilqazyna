<?php
$this->title = $user['username']." ".$user['lastname'];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="profile-page">
    <div class="profile-page__in floated">
        <div class="main-page__left">
            <div class="profile-b">
                <div class="profile__img-b" style="background: url('<? if(!empty($user['background'])){echo $user['background'];}else{echo "/img/profile.jpg";} ?>') 50% 50% no-repeat; background-size: cover;"></div>
                <div class="profile__name-b floated">
                    <div class="profile__status__link-b"><a href="/users/<?=$user['id']?>" class="profile__status__link">Жазылу</a></div>
                    <div class="profile__name__img-b">
                        <img src="<? if(!empty($user['avatar'])){echo $user['avatar'];}else{echo "/img/user.png";} ?>" class="profile__name__img"/>
                    </div>
                    <div class="profile__name">
                        <div class="profile__name-text"><?=$user['username']?> <?=$user['lastname']?></div>
                        <div class="profile__location floated">
                            <svg version="1.1" class="profile__location__icon location-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 14" enable-background="new 0 0 10 14">
                                <path fill="#FFFFFF" d="M5,2.625c-1.33,0-2.412,1.104-2.412,2.462C2.588,6.443,3.67,7.548,5,7.548s2.412-1.104,2.412-2.461C7.412,3.729,6.33,2.625,5,2.625z M5,6.482c-0.745,0-1.352-0.626-1.352-1.396C3.648,4.316,4.255,3.69,5,3.69c0.746,0,1.352,0.626,1.352,1.396C6.352,5.856,5.746,6.482,5,6.482z M8.401,1.208C7.531,0.429,6.322,0,5,0C3.677,0,2.469,0.429,1.599,1.208C0.553,2.145,0,3.567,0,5.323c0,3.825,4.383,8.308,4.57,8.497C4.684,13.936,4.838,14,5,14c0.162,0,0.316-0.064,0.43-0.18C5.617,13.631,10,9.148,10,5.323C10,3.567,9.447,2.145,8.401,1.208z M5,12.499c-0.41-0.457-1.057-1.218-1.701-2.136C1.934,8.42,1.212,6.677,1.212,5.323c0-3.81,2.899-4.105,3.788-4.105c3.515,0,3.788,3.143,3.788,4.105C8.788,8.003,6.074,11.299,5,12.499z"/>
                            </svg>
                            <?=$user['city']?>
                        </div>

                    </div>
                    <div class="profile__status-b floated">
                        <div class="profile__status">
                            <span class="main-page__rating__status">статус:</span><span class="main-page__rating__status-text"><? echo \common\components\MyLib\MyLib::getRole($user['link_role']);?></span>
                        </div>
                        <div class="profile__count-b floated">
                            <svg version="1.1" class="profile__graph-icon graph-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 15 20" enable-background="new 0 0 15 20">
                                <path fill="#249F41" d="M7.5,5.679c-0.753,0-1.363,0.624-1.363,1.395v11.531C6.137,19.375,6.748,20,7.5,20c0.753,0,1.364-0.625,1.364-1.396V7.073C8.864,6.303,8.254,5.679,7.5,5.679z M1.364,11.358C0.61,11.358,0,11.983,0,12.754v5.851C0,19.375,0.61,20,1.364,20c0.753,0,1.363-0.625,1.363-1.396v-5.851C2.727,11.983,2.117,11.358,1.364,11.358z M13.637,0c-0.754,0-1.364,0.625-1.364,1.396v17.209c0,0.771,0.61,1.396,1.364,1.396C14.39,20,15,19.375,15,18.604V1.396C15,0.625,14.39,0,13.637,0z"/>
                            </svg>
                            <?php echo rand(100,700); ?>
                        </div>
                        <div class="profile__subscribers-b">
                            <span class="profile__subscribers"><?php echo \common\models\Subscribe::find()->where(['author'=>$user['id']])->count(); ?></span><span class="profile__subscribers-text">Жазылушылар</span>
                        </div>
                    </div>
                </div>

                <div class="profile__menu-b floated">
                    <div class="profile__menu floated">
                        <span class="profile__menu__item profile__menu__item--active">Менің жаңалықтарым</span>
                        <?php if($user['link_role'] == 3){?>
                            <span class="profile__menu__item">Ғылымнан кеңес</span>
                        <? } ?>

                        <?php if($user['link_role'] == 2 or $user['link_role'] == 3){?>
                            <span class="profile__menu__item">Әдіскерге көмек</span>
                            <span class="profile__menu__item">Видео</span>
                            <span class="profile__menu__item">Аудио</span>
                        <? } ?>
                        <span class="profile__menu__item">Кітаптар</span>
                        <span class="profile__menu__item">Толғаныс</span>
                    </div>
                </div>

                <div class="profile__tabs">
                    <div class="profile__tab profile__tab--gray profile__tab--active">
                        <div class="profile__news-b">
                            <div class="profile__news-list">
                                <? foreach ($news as $new) {?>
                                    <div class="profile__news-day">
                                        <div class="profile__news-day__title-b">
                                            <h3 class="profile__news-day__title"><? if($new['date'] == date('d.m.Y')){echo "Бүгін";}else{echo $new['date']; } ?></h3>
                                        </div>
                                        <div class="profile__news-day__item">
                                            <div class="profile__news-day__item__title-b floated">
                                                <div class="profile__news-day__item__img-b floated">
                                                    <img src="http://placehold.it/40x40" class="profile__news-day__img"/>
                                                </div>
                                                <div class="profile__news-day__item__name-b">
                                                    <? $new_user = \common\models\User::findOne($new['author_link']); ?>
                                                    <a href="/users/<?=$new['author_link']?>"><div class="profile__news-day__item__name"><?=$new['author']?></div></a>
                                                    <div class="profile__news-day__item__status"><? echo \common\components\MyLib\MyLib::getRole($new_user['link_role']);?></div>
                                                </div>
                                                <div class="profile__news-day__item__text">
                                                    <? echo \common\components\MyLib\MyLib::getCatName($new['cat_id']); ?> бөліміне жаңа материал қосты
                                                </div>
                                            </div>
                                            <div class="profile__news-day__item__body floated">
                                                <div class="main-page__media-b floated">
                                                    <?if($new['cat_id']==15){?>
                                                        <a href="/article/<?=$new['id']?>">
                                                            <div class="main-page__media ">
                                                                <img src="<? echo \common\components\MyLib\MyLib::getImg($new['id']) ?>" class="main-page__media__img">
                                                                <div class="main-page__media__text-b">
                                                                    <?=$new['title']?>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    <?}elseif($new['cat_id']==18){?>
                                                        <div class="main-page__media main-page__media--audio mobile-640">
                                                            <div class="main-page__media__text-b">
                                                                <?=$new['title']?>
                                                            </div>
                                                            <a href="/article/<?=$new['id']?>" class="block-link"></a>
                                                        </div>
                                                    <?}else{?>
                                                        <a href="/article/<?=$new['id']?>" class="blue-link"><?=$new['title']?></a>
                                                    <?}?>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                <?}?>

                            </div>
                            <!--<div class="profile__news__link-b">
                                <a href="" class="profile__news__link">Тағы жүктеу</a>
                            </div>-->
                        </div>
                    </div>

                    <?php if($user['link_role'] == 3){?>
                        <div class="profile__tab">

                            <div class="main-page__news-b floated">
                                <?php
                                $i = 1;
                                foreach ($keneses as $kenes) {?>

                                    <div class="main-page__news">
                                        <div class="main-page__news__img-b">
                                            <img src="<?=$kenes['img']?>" class="main-page__news__img"/>
                                            <div class="main-page__views-b js-views-b">
                                    <span class="main-page__views">
                                         <svg version="1.1" class="main-page__views-icon" viewBox="0 0 21 12" enable-background="new 0 0 21 12">
                                             <path fill="#CCCCCC" d="M11.028,2.346c-1-0.138-1.994,0.112-2.8,0.705C6.565,4.274,6.23,6.591,7.48,8.217c0.606,0.789,1.492,1.3,2.492,1.438c0.178,0.024,0.358,0.037,0.536,0.037c0.814,0,1.602-0.256,2.263-0.743c1.662-1.222,1.998-3.539,0.748-5.166C12.913,2.994,12.028,2.483,11.028,2.346z M11.946,7.885c-0.514,0.378-1.147,0.537-1.782,0.449C9.528,8.246,8.963,7.921,8.577,7.418c-0.799-1.04-0.586-2.521,0.477-3.303c0.514-0.378,1.146-0.537,1.783-0.449c0.637,0.088,1.201,0.413,1.586,0.915C13.223,5.622,13.008,7.104,11.946,7.885zM11.212,4.418c-0.243,0-0.477,0.093-0.646,0.26c-0.171,0.164-0.267,0.394-0.267,0.629c0,0.233,0.096,0.462,0.267,0.629c0.169,0.164,0.403,0.26,0.646,0.26c0.24,0,0.476-0.096,0.645-0.26c0.172-0.167,0.268-0.396,0.268-0.629c0-0.235-0.096-0.465-0.268-0.629C11.688,4.511,11.452,4.418,11.212,4.418z M20.846,5.505C20.691,5.28,16.98,0,10.5,0C4.02,0,0.309,5.28,0.154,5.505c-0.206,0.3-0.206,0.69,0,0.99C0.309,6.72,4.02,12,10.5,12c6.481,0,10.192-5.28,10.346-5.505C21.052,6.195,21.052,5.805,20.846,5.505z M10.5,10.223c-4.409,0-7.41-3.014-8.438-4.225c1.023-1.212,4.009-4.22,8.438-4.22c4.409,0,7.41,3.011,8.437,4.222C17.907,7.212,14.906,10.223,10.5,10.223z"/>
                                         </svg>
                                        <?=$kenes['views']?>
                                    </span>
                                       <span class="main-page__views">
                                         <svg version="1.1" class="main-page__message-icon" viewBox="0 0 14 13" enable-background="new 0 0 14 13">
                                             <path fill="#FFFFFF" d="M9.947,4.264c0.16,0,0.316-0.069,0.432-0.191c0.111-0.12,0.178-0.288,0.178-0.458c0-0.171-0.066-0.34-0.178-0.46c-0.113-0.122-0.27-0.19-0.432-0.19c-0.16,0-0.316,0.068-0.43,0.19c-0.113,0.12-0.179,0.287-0.179,0.46c0,0.17,0.065,0.338,0.179,0.458C9.631,4.194,9.787,4.264,9.947,4.264z M3.445,4.225h4.407c0.336,0,0.609-0.291,0.609-0.649c0-0.359-0.273-0.65-0.609-0.65H3.445c-0.336,0-0.608,0.291-0.608,0.65C2.836,3.934,3.109,4.225,3.445,4.225z M13.392,0H0.609C0.272,0,0,0.291,0,0.65v8.298c0,0.359,0.272,0.64,0.609,0.64h7.152v2.762c0,0.273,0.192,0.517,0.433,0.61C8.262,12.987,8.35,13,8.42,13c0.175,0,0.354-0.087,0.473-0.235l2.525-3.177h1.974c0.336,0,0.608-0.28,0.608-0.64V0.65C14,0.291,13.728,0,13.392,0z M12.783,8.287h-1.647c-0.179,0-0.382,0.09-0.497,0.235l-1.66,2.056v-1.63c0-0.358-0.206-0.661-0.543-0.661H1.217V1.3h11.566V8.287z"/>
                                         </svg>
                                           <?=$kenes['comments']?>
                                    </span>
                                            </div>
                                            <a href="/article/<?=$kenes['id']?>" class="main-page__news__link js-views-link"></a>
                                        </div>
                                        <div class="main-page__news__body">
                                            <h2 class="main-page__news__section">Әдіс</h2>
                                            <h3 class="main-page__news__title"><?=$kenes['title']?></h3>
                                            <p class="main-page__news__text"><?php echo \common\models\Articles::preview($kenes['text']);?>...</p>
                                        </div>
                                    </div>

                                    <?php
                                    $i++;
                                }?>
                            </div>
                        </div>
                    <? } ?>
                    <?php if($user['link_role'] == 2 or $user['link_role'] == 3){?>
                        <div class="profile__tab">
                            <div class="main-page__news-b floated">
                                <?php
                                $i = 1;
                                foreach ($komeks as $komek) {?>

                                    <div class="main-page__news">
                                        <div class="main-page__news__img-b">
                                            <img src="<?=$komek['img']?>" class="main-page__news__img"/>
                                            <div class="main-page__views-b js-views-b">
                                    <span class="main-page__views">
                                         <svg version="1.1" class="main-page__views-icon" viewBox="0 0 21 12" enable-background="new 0 0 21 12">
                                             <path fill="#CCCCCC" d="M11.028,2.346c-1-0.138-1.994,0.112-2.8,0.705C6.565,4.274,6.23,6.591,7.48,8.217c0.606,0.789,1.492,1.3,2.492,1.438c0.178,0.024,0.358,0.037,0.536,0.037c0.814,0,1.602-0.256,2.263-0.743c1.662-1.222,1.998-3.539,0.748-5.166C12.913,2.994,12.028,2.483,11.028,2.346z M11.946,7.885c-0.514,0.378-1.147,0.537-1.782,0.449C9.528,8.246,8.963,7.921,8.577,7.418c-0.799-1.04-0.586-2.521,0.477-3.303c0.514-0.378,1.146-0.537,1.783-0.449c0.637,0.088,1.201,0.413,1.586,0.915C13.223,5.622,13.008,7.104,11.946,7.885zM11.212,4.418c-0.243,0-0.477,0.093-0.646,0.26c-0.171,0.164-0.267,0.394-0.267,0.629c0,0.233,0.096,0.462,0.267,0.629c0.169,0.164,0.403,0.26,0.646,0.26c0.24,0,0.476-0.096,0.645-0.26c0.172-0.167,0.268-0.396,0.268-0.629c0-0.235-0.096-0.465-0.268-0.629C11.688,4.511,11.452,4.418,11.212,4.418z M20.846,5.505C20.691,5.28,16.98,0,10.5,0C4.02,0,0.309,5.28,0.154,5.505c-0.206,0.3-0.206,0.69,0,0.99C0.309,6.72,4.02,12,10.5,12c6.481,0,10.192-5.28,10.346-5.505C21.052,6.195,21.052,5.805,20.846,5.505z M10.5,10.223c-4.409,0-7.41-3.014-8.438-4.225c1.023-1.212,4.009-4.22,8.438-4.22c4.409,0,7.41,3.011,8.437,4.222C17.907,7.212,14.906,10.223,10.5,10.223z"/>
                                         </svg>
                                        <?=$komek['views']?>
                                    </span>
                                       <span class="main-page__views">
                                         <svg version="1.1" class="main-page__message-icon" viewBox="0 0 14 13" enable-background="new 0 0 14 13">
                                             <path fill="#FFFFFF" d="M9.947,4.264c0.16,0,0.316-0.069,0.432-0.191c0.111-0.12,0.178-0.288,0.178-0.458c0-0.171-0.066-0.34-0.178-0.46c-0.113-0.122-0.27-0.19-0.432-0.19c-0.16,0-0.316,0.068-0.43,0.19c-0.113,0.12-0.179,0.287-0.179,0.46c0,0.17,0.065,0.338,0.179,0.458C9.631,4.194,9.787,4.264,9.947,4.264z M3.445,4.225h4.407c0.336,0,0.609-0.291,0.609-0.649c0-0.359-0.273-0.65-0.609-0.65H3.445c-0.336,0-0.608,0.291-0.608,0.65C2.836,3.934,3.109,4.225,3.445,4.225z M13.392,0H0.609C0.272,0,0,0.291,0,0.65v8.298c0,0.359,0.272,0.64,0.609,0.64h7.152v2.762c0,0.273,0.192,0.517,0.433,0.61C8.262,12.987,8.35,13,8.42,13c0.175,0,0.354-0.087,0.473-0.235l2.525-3.177h1.974c0.336,0,0.608-0.28,0.608-0.64V0.65C14,0.291,13.728,0,13.392,0z M12.783,8.287h-1.647c-0.179,0-0.382,0.09-0.497,0.235l-1.66,2.056v-1.63c0-0.358-0.206-0.661-0.543-0.661H1.217V1.3h11.566V8.287z"/>
                                         </svg>
                                           <?=$komek['comments']?>
                                    </span>
                                            </div>
                                            <a href="/article/<?=$komek['id']?>" class="main-page__news__link js-views-link"></a>
                                        </div>
                                        <div class="main-page__news__body">
                                            <h2 class="main-page__news__section">Әдіс</h2>
                                            <h3 class="main-page__news__title"><?=$komek['title']?></h3>
                                            <p class="main-page__news__text"><?php echo \common\models\Articles::preview($komek['text']);?>...</p>
                                        </div>
                                    </div>

                                    <?php
                                    $i++;
                                }?>
                            </div>
                        </div>

                        <div class="profile__tab">
                            <div class="main-page__media-b">
                                <div class="main-page__media__items floated">
                                    <?php
                                    $i = 1;
                                    foreach ($videos as $video) {?>
                                        <a href="/article/<?=$video['id']?>">
                                            <div class="main-page__media <?if($i==1){echo 'main-page__media--main';}else{echo 'mobile-640';}?>">
                                                <img src="<? echo \common\components\MyLib\MyLib::getImg($video['id']) ?>" class="main-page__media__img">
                                                <div class="main-page__media__text-b">
                                                    <?=$video['title']?>
                                                </div>
                                            </div>
                                        </a>
                                        <?
                                        $i++;
                                    }
                                    ?>
                                </div>
                            </div>
                        </div>

                        <div class="profile__tab">
                            <div class="main-page__media-b main-page__media-b--tolganys">
                                <div class="main-page__media__items floated">
                                    <?
                                    $i = 1;
                                    foreach ($audios as $audio) {?>

                                        <div class="main-page__media main-page__media--audio">
                                            <div class="main-page__media__text-b">
                                                <?=$audio['title']?>
                                            </div>
                                            <a href="/article/<?=$audio['id']?>" class="block-link"></a>
                                        </div>
                                        <?

                                        $i++;
                                    }?>
                                </div>
                            </div>
                        </div>
                    <? } ?>
                    <div class="profile__tab">
                        <div class="main-page__tartu-b">
                            <div class="main-page__tartu__items floated">
                                <?
                                $i = 0;
                                foreach ($books as $book) {

                                ?>
                                <div class="main-page__tartu">
                                    <div class="main-page__tartu__img-b">
                                        <img src="<?=$book['img']?>" class="main-page__tartu__img"/>
                                        <div class="main-page__tartu__link-b js-tartu-link">
                                            <a href="/tartu/one/<?=$book['id']?>" class="main-page__tartu__link js-tartu-b">Оқу</a>
                                        </div>
                                    </div>
                                    <a href="" class="main-page__tartu__section"><?=$book['title']?></a>
                                    <div class="main-page__tartu__author"><?=$book['author']?></div>
                                </div>


                                <?
                                $i++;
                                }?>
                            </div>
                        </div>
                    </div>

                    <div class="profile__tab profile__tab--orange-light">
                        <div class="main-page__tolganys-b main-page__tolganys-b--profile">
                            <div class="main-page__tolganys__items floated">
                                <?if(!empty($blogs)){?>
                                    <? foreach ($blogs as $blog) {?>
                                        <div class="main-page__tolganys__item">
                                            <div class="main-page__tolganys__img-b">
                                                <img src="<?=$blog['img']?>" class="main-page__tolganys__img">
                                            </div>
                                            <div class="main-page__tolganys__item__body">
                                                <a href="/article/<?=$blog['id']?>"><h3 class="main-page__tolganys__item__title"><?=$blog['title']?></h3></a>
                                                <div class="main-page__tolganys__item__views-b">
                                    <span class="main-page__tolganys__item__views">
                                         <svg version="1.1" class="main-page__date-icon" viewBox="0 0 19 17" enable-background="new 0 0 19 17">
                                             <path fill="#999999" d="M13.424,4.671c0.57,0,1.033-0.458,1.033-1.023V1.024C14.457,0.459,13.994,0,13.424,0s-1.032,0.459-1.032,1.024v2.623C12.392,4.213,12.854,4.671,13.424,4.671z M8.197,3.072h2.607c0.456,0,0.826-0.367,0.826-0.819s-0.37-0.819-0.826-0.819H8.197c-0.456,0-0.826,0.367-0.826,0.819S7.741,3.072,8.197,3.072z M18.174,1.434h-1.931c-0.456,0-0.826,0.367-0.826,0.819s0.37,0.819,0.826,0.819h1.104v3.482H1.652V3.072h1.105c0.456,0,0.826-0.367,0.826-0.819s-0.37-0.819-0.826-0.819H0.827C0.37,1.434,0,1.876,0,2.329v13.852C0,16.633,0.37,17,0.827,17h17.347C18.631,17,19,16.633,19,16.181V2.329C19,1.876,18.631,1.434,18.174,1.434z M17.348,15.361H1.652V7.988h15.696V15.361zM5.576,4.671c0.57,0,1.033-0.458,1.033-1.023V1.024C6.609,0.459,6.146,0,5.576,0S4.543,0.459,4.543,1.024v2.623C4.543,4.213,5.006,4.671,5.576,4.671z"/>
                                         </svg>
                                        <?=$blog['date']?>
                                    </span>
                                    <span class="main-page__tolganys__item__views">
                                        <svg version="1.1" class="main-page__views-icon" viewBox="0 0 21 12" enable-background="new 0 0 21 12">
                                            <path fill="#999999" d="M11.028,2.346c-1-0.138-1.994,0.112-2.8,0.705C6.565,4.274,6.23,6.591,7.48,8.217c0.606,0.789,1.492,1.3,2.492,1.438c0.178,0.024,0.358,0.037,0.536,0.037c0.814,0,1.602-0.256,2.263-0.743c1.662-1.222,1.998-3.539,0.748-5.166C12.913,2.994,12.028,2.483,11.028,2.346z M11.946,7.885c-0.514,0.378-1.147,0.537-1.782,0.449C9.528,8.246,8.963,7.921,8.577,7.418c-0.799-1.04-0.586-2.521,0.477-3.303c0.514-0.378,1.146-0.537,1.783-0.449c0.637,0.088,1.201,0.413,1.586,0.915C13.223,5.622,13.008,7.104,11.946,7.885zM11.212,4.418c-0.243,0-0.477,0.093-0.646,0.26c-0.171,0.164-0.267,0.394-0.267,0.629c0,0.233,0.096,0.462,0.267,0.629c0.169,0.164,0.403,0.26,0.646,0.26c0.24,0,0.476-0.096,0.645-0.26c0.172-0.167,0.268-0.396,0.268-0.629c0-0.235-0.096-0.465-0.268-0.629C11.688,4.511,11.452,4.418,11.212,4.418z M20.846,5.505C20.691,5.28,16.98,0,10.5,0C4.02,0,0.309,5.28,0.154,5.505c-0.206,0.3-0.206,0.69,0,0.99C0.309,6.72,4.02,12,10.5,12c6.481,0,10.192-5.28,10.346-5.505C21.052,6.195,21.052,5.805,20.846,5.505z M10.5,10.223c-4.409,0-7.41-3.014-8.438-4.225c1.023-1.212,4.009-4.22,8.438-4.22c4.409,0,7.41,3.011,8.437,4.222C17.907,7.212,14.906,10.223,10.5,10.223z"/>
                                        </svg>
                                        <?=$blog['views']?>
                                    </span>
                                    <span class="main-page__tolganys__item__views">
                                         <svg version="1.1" class="main-page__message-icon" viewBox="0 0 14 13" enable-background="new 0 0 14 13">
                                             <path fill="#999999" d="M9.947,4.264c0.16,0,0.316-0.069,0.432-0.191c0.111-0.12,0.178-0.288,0.178-0.458c0-0.171-0.066-0.34-0.178-0.46c-0.113-0.122-0.27-0.19-0.432-0.19c-0.16,0-0.316,0.068-0.43,0.19c-0.113,0.12-0.179,0.287-0.179,0.46c0,0.17,0.065,0.338,0.179,0.458C9.631,4.194,9.787,4.264,9.947,4.264z M3.445,4.225h4.407c0.336,0,0.609-0.291,0.609-0.649c0-0.359-0.273-0.65-0.609-0.65H3.445c-0.336,0-0.608,0.291-0.608,0.65C2.836,3.934,3.109,4.225,3.445,4.225z M13.392,0H0.609C0.272,0,0,0.291,0,0.65v8.298c0,0.359,0.272,0.64,0.609,0.64h7.152v2.762c0,0.273,0.192,0.517,0.433,0.61C8.262,12.987,8.35,13,8.42,13c0.175,0,0.354-0.087,0.473-0.235l2.525-3.177h1.974c0.336,0,0.608-0.28,0.608-0.64V0.65C14,0.291,13.728,0,13.392,0z M12.783,8.287h-1.647c-0.179,0-0.382,0.09-0.497,0.235l-1.66,2.056v-1.63c0-0.358-0.206-0.661-0.543-0.661H1.217V1.3h11.566V8.287z"/>
                                         </svg>
                                        <?=$blog['comments']?>
                                    </span>
                                                </div>
                                                <div class="main-page__tolganys__item__author-b floated">
                                                    <?
                                                    $user = \common\models\User::findOne($blog['author_link']);
                                                    ?>
                                                    <img src="<? if(!empty($user['avatar'])){echo $user['avatar'];}else{echo "/img/user.png";} ?>" class="main-page__tolganys__item__author-img"/>
                                                    <a href="/users/<?=$user['id']?>" class="main-page__tolganys__item__author-link">
                                                        <?=$user['username']?><br><?=$user['lastname']?>
                                                    </a>
                                                </div>
                                                <div class="main-page__tolganys__item__status-b">
                                                    <span class="main-page__rating__status">статус:</span><span class="main-page__rating__status-text"><? echo \common\components\MyLib\MyLib::getRole($user['link_role']);?></span>
                                                </div>
                                            </div>
                                        </div>
                                    <?}?>

                                <?}else{?>

                                <?}?>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="sidebar">
            <div class="main-page__title-b main-page__title-b--page">
                <h3 class="sidebar__title">
                    Танымал қолданушылар
                </h3>
            </div>
            <div class="sidebar__images-b floated">
                <? foreach ($others as $other) {?>
                    <div class="sidebar__image-b">
                        <a href="/users/<?=$other['id']?>"><img src="<? if(!empty($other['avatar'])){echo $other['avatar'];}else{echo "/img/user.png";} ?>" class="sidebar__image"/> </a>
                    </div>
                <?}?>

            </div>

            <? echo \frontend\widgets\More::widget(); ?>
            <? echo \frontend\widgets\Popular::widget(); ?>
        </div>
    </div>

</div>
