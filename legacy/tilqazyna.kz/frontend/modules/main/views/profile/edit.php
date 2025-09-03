<?php
$this->title = "Жеке кабинет - Түзету";
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="profile-page">
    <div class="profile-page__in floated">
        <div class="main-page__left">
            <div class="profile-b">
                <?php $form = \yii\widgets\ActiveForm::begin(['action'=>'/profile/edit','options'=>['enctype' => 'multipart/form-data']]) ?>
                <div class="profile__img-b" style="background: url('<?php if(!empty($user['background'])){echo $user['background'];}else{echo "/img/profile.jpg";} ?>') 50% 50% no-repeat; background-size: cover;"></div>
                <div class="profile__name-b floated">
                    <div class="profile__status__link-b">
                        <!--<a href="" class="profile__status__link" style="background: #ACACAC;">
                            <svg version="1.1" class="profile__name__img-cross__icon" style="display: inline-block; margin: -2px 10px -3px 0;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" enable-background="new 0 0 10 10">
                                <path fill="#ffffff" d="M5.884,5l3.933-3.932c0.244-0.244,0.244-0.64,0-0.884c-0.244-0.245-0.64-0.245-0.884,0L5,4.116L1.067,0.184c-0.245-0.245-0.64-0.245-0.884,0c-0.245,0.244-0.245,0.64,0,0.884L4.116,5L0.183,8.933c-0.245,0.244-0.245,0.64,0,0.884C0.305,9.938,0.465,10,0.625,10c0.16,0,0.32-0.062,0.442-0.184L5,5.884l3.933,3.933C9.055,9.938,9.215,10,9.374,10c0.16,0,0.32-0.062,0.442-0.184c0.244-0.244,0.244-0.64,0-0.884L5.884,5z"/>
                            </svg>
                            Удалить
                        </a>
                        <a href="" class="profile__status__link" style="background: #1A5A9D; margin: 0 0 0 20px;">
                            <svg version="1.1" class="profile__name__img-cross__icon" style="display: inline-block; margin: -2px 10px -3px 0;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 15 15" enable-background="new 0 0 15 15">
                                <path fill="#FFFFFF" d="M5.258,8.779l-3.894,3.892v-1.763c0-0.376-0.299-0.68-0.674-0.681c-0.375,0.001-0.679,0.306-0.679,0.681v3.41c0,0.181,0.072,0.354,0.2,0.481S0.513,15,0.693,15H4.1c0.377,0,0.682-0.306,0.682-0.682c0-0.377-0.306-0.682-0.682-0.682H2.339l3.89-3.894c0.266-0.267,0.263-0.698-0.003-0.964C5.959,8.513,5.524,8.513,5.258,8.779z M14.8,0.2C14.673,0.072,14.499,0,14.318,0h-3.407c-0.376,0-0.682,0.306-0.682,0.682c0,0.377,0.306,0.682,0.682,0.682h1.762L8.711,5.329c-0.267,0.267-0.267,0.698,0,0.965c0.133,0.133,0.308,0.199,0.482,0.199c0.174,0,0.349-0.066,0.481-0.199l3.962-3.965v1.762c0,0.377,0.305,0.683,0.682,0.683C14.694,4.773,15,4.468,15,4.092v-3.41C15,0.501,14.928,0.327,14.8,0.2z M2.327,1.425h1.761c0.376,0,0.682-0.305,0.682-0.682c0-0.376-0.305-0.682-0.682-0.682H0.682c-0.181,0-0.354,0.071-0.482,0.199S0,0.563,0,0.743l0,3.409c0,0.377,0.305,0.682,0.682,0.682c0.376,0,0.682-0.305,0.682-0.682V2.39l3.93,3.934c0.133,0.134,0.308,0.2,0.482,0.2c0.174,0,0.349-0.066,0.481-0.199c0.267-0.267,0.267-0.698,0.001-0.965L2.327,1.425z M14.318,10.227c-0.377,0-0.682,0.306-0.682,0.682v1.763L9.742,8.81C9.476,8.543,9.025,8.543,8.759,8.809C8.493,9.075,8.483,9.507,8.75,9.773l3.854,3.863H10.84c-0.377,0-0.683,0.305-0.683,0.681c0,0.377,0.305,0.682,0.682,0.683h3.406c0.181,0,0.391-0.072,0.519-0.199C14.892,14.672,15,14.499,15,14.318v-3.41C15,10.532,14.694,10.227,14.318,10.227z"/>
                            </svg>
                            Разместить
                        </a>-->
                        <a href="javascript:void(0)" class="profile__status__link js-file-link" style="background: #EF7A00; margin: 0 0 0 20px;">
                            <svg version="1.1" class="profile__name__img-cross__icon" style="display: inline-block; margin: -2px 10px -3px 0;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 19 16" enable-background="new 0 0 19 16">
                                <path fill="#FFFFFF" d="M10.309,6.631c-0.362-0.159-0.783,0.002-0.947,0.36C9.196,7.35,9.357,7.774,9.717,7.94c0.029,0.014,0.73,0.346,0.651,0.937c-0.052,0.393,0.226,0.754,0.622,0.806c0.032,0.005,0.063,0.007,0.096,0.007c0.356,0,0.667-0.263,0.716-0.624C11.979,7.742,10.947,6.912,10.309,6.631z M9.622,9.723c-0.217,0-0.43,0.087-0.584,0.24c-0.153,0.152-0.242,0.363-0.242,0.581c0,0.215,0.089,0.427,0.242,0.58c0.154,0.152,0.367,0.24,0.584,0.24s0.43-0.088,0.584-0.24c0.153-0.153,0.242-0.365,0.242-0.58c0-0.218-0.089-0.429-0.242-0.581C10.052,9.81,9.839,9.723,9.622,9.723z M18.174,3.897H15l-0.888-3.276C14.015,0.263,13.688,0,13.314,0H5.686c-0.373,0-0.7,0.263-0.797,0.621L4.001,3.897H0.826C0.37,3.897,0,4.236,0,4.689v10.49C0,15.633,0.37,16,0.826,16h17.348C18.631,16,19,15.633,19,15.18V4.689C19,4.236,18.631,3.897,18.174,3.897z M17.348,14.359H1.652V5.538h2.981c0.374,0,0.7-0.263,0.797-0.62l0.888-3.277h6.364l0.888,3.277c0.097,0.357,0.424,0.62,0.797,0.62h2.98V14.359z M9.5,4.104c-2.612,0-4.737,2.139-4.737,4.768c0,2.628,2.125,4.767,4.737,4.767s4.737-2.139,4.737-4.767C14.237,6.242,12.112,4.104,9.5,4.104z M9.5,11.997c-1.701,0-3.085-1.402-3.085-3.126c0-1.725,1.384-3.127,3.085-3.127s3.085,1.402,3.085,3.127C12.585,10.595,11.201,11.997,9.5,11.997z"/>
                            </svg>
                            Фонды жүктеу
                        </a>
                        <input type="file" name="background" class="profile__name__img-file-input js-file-input">
                    </div>
                    <div class="profile__name__img-b">
                        <img src="<?php if(!empty($user['avatar'])){echo $user['avatar'];}else{echo "/img/user.png";} ?>" class="profile__name__img"/>
                        <a href="javascript:void(0)" class="profile__name__img-cross">
                            <svg version="1.1" class="profile__name__img-cross__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" enable-background="new 0 0 10 10">
                                <path fill="#D81427" d="M5.884,5l3.933-3.932c0.244-0.244,0.244-0.64,0-0.884c-0.244-0.245-0.64-0.245-0.884,0L5,4.116L1.067,0.184c-0.245-0.245-0.64-0.245-0.884,0c-0.245,0.244-0.245,0.64,0,0.884L4.116,5L0.183,8.933c-0.245,0.244-0.245,0.64,0,0.884C0.305,9.938,0.465,10,0.625,10c0.16,0,0.32-0.062,0.442-0.184L5,5.884l3.933,3.933C9.055,9.938,9.215,10,9.374,10c0.16,0,0.32-0.062,0.442-0.184c0.244-0.244,0.244-0.64,0-0.884L5.884,5z"/>
                            </svg>
                        </a>
                    </div>
                    <div class="profile__name__img-link-b">
                        <a class="profile__name__img-link js-file-link">Фото ауыстыру</a>
                        <input type="file" name="avatar" class="profile__name__img-file-input js-file-input">
                    </div>
                </div>
                <div class="profile__setting-b">
                    <div class="profile__setting-form-b floated">
                        <div class="profile__setting-form__left">
                            <div class="profile__setting__input-b">
                                <label class="profile__setting__label">Аты</label>
                                <input name="username" value="<?php echo $user['username']?>" type="text" class="profile__setting__input">
                            </div>
                            <div class="profile__setting__input-b">
                                <label class="profile__setting__label">Тегі</label>
                                <input type="text" name="lastname" value="<?php echo $user['lastname']?>" class="profile__setting__input">
                            </div>
                            <div class="profile__setting__input-b">
                                <label class="profile__setting__label">Қала</label>
                                <input type="text" value="<?php echo $user['city']?>" name="city" class="profile__setting__input">
                            </div>
                            <div class="profile__setting__input-b">
                                <label class="profile__setting__label">Туған күні</label>
                                <input type="date" value="<?php echo $user['birthday']?>" name="birthday" class="profile__setting__input">
                            </div>
                        </div>
                        <div class="profile__setting-form__right">
                            <div class="profile__setting__input-b">
                                <h4 class="profile__setting__title">Парольді өзгерту</h4>
                            </div>
                            <div class="profile__setting__input-b">
                                <label class="profile__setting__label">Ескі пароль</label>
                                <input type="password" class="profile__setting__input">
                            </div>
                            <div class="profile__setting__input-b">
                                <label class="profile__setting__label">Жаңа пароль</label>
                                <input type="password" name="password"  class="profile__setting__input">
                            </div>
                            <div class="profile__setting__input-b">
                                <label class="profile__setting__label">Парольды қайталау</label>
                                <input type="password" class="profile__setting__input">
                            </div>
                        </div>
                    </div>
                    <div class="profile__setting__link-b">
                        <button type="submit" class="link link--orange">Сақтау</button>
                    </div>
                    <?php \yii\widgets\ActiveForm::end();?>
                    <div class="profile__setting__request-b">
                        <h4 class="profile__setting__request-title">СТАТУСТЫ ӨЗГЕРТУГЕ СҰРАНЫС</h4>
                        <div class="profile__setting__input-b">
                            <label class="profile__setting__label">Статусты таңдау</label>
                            <select class="profile__setting__input">
                                <option>Әдіскер</option>
                                <option>Ғалым</option>
                            </select>
                        </div>
                        <textarea class="profile__setting__request__textarea" placeholder="Хабарлама"></textarea>
                        <div class="profile__setting__link-b">
                            <a href="/profile" class="link link--orange">Жіберу</a>
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
                <?php foreach ($others as $other) {?>
                    <div class="sidebar__image-b">
                        <a href="/users/<?php echo $other['id']?>"><img src="<?php if(!empty($other['avatar'])){echo $other['avatar'];}else{echo "/img/user.png";} ?>" class="sidebar__image"/> </a>
                    </div>
                <?php }?>

            </div>

            <?php echo \frontend\widgets\More::widget(); ?>
            <?php echo \frontend\widgets\Popular::widget(); ?>
        </div>
    </div>

</div>