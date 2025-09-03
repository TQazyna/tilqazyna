<aside class="main-sidebar">

    <section class="sidebar">

        <!-- Sidebar user panel -->
        <?php echo dmstr\widgets\Menu::widget(
            [
                'options' => ['class' => 'sidebar-menu'],
                'items' => [
                    ['label' => 'Адмнистрация', 'options' => ['class' => 'header']],
                    //['label' => 'Gii', 'icon' => 'fa fa-file-code-o', 'url' => ['/gii']],
                    ['label' => 'Login', 'url' => ['site/login'], 'visible' => Yii::$app->user->isGuest],
                    //['label' => 'Категории', 'icon' => 'fa fa-dashboard', 'url' => ['/category'],],
                    ['label' => 'Жаңалықтар', 'icon' => 'fa fa-dashboard', 'url' => ['/articles'],],
                    ['label' => 'Хабарландырулар', 'icon' => 'fa fa-dashboard', 'url' => ['/announcements'],],
                    ['label' => 'Жіберілген мақала', 'icon' => 'fa fa-dashboard', 'url' => ['/register'],],
                    ['label' => 'Баспа меню', 'icon' => 'fa fa-dashboard', 'url' => ['/baspa'],],
                    //  ['label' => 'Баннера', 'icon' => 'fa fa-dashboard', 'url' => ['/banners'],],
                    ['label' => 'Меню', 'options' => ['class' => 'header']],
                    [
                        'label' => 'Біз туралы',
                        'icon' => 'nav-icon fa fa-code',
                        'url' => '#',
                        'items' => [
                            ['label' => 'Қоғамның мақсаты, міндеттері', 'icon' => 'fa fa-user', 'url' => ['/community']],
                            ['label' => 'Басшылық', 'icon' => 'fa fa-github', 'url' => ['/director']],
                            ['label' => 'Құрылым', 'icon' => 'fa fa-gg', 'url' => ['/stucture']],
                            ['label' => 'Басқармалар', 'icon' => 'fa fa-user', 'url' => ['/leaders']],
                            ['label' => 'Мемлекеттіл сатып алу', 'icon' => 'fa fa-github', 'url' => ['/goszakup']],
                            ['label' => 'Құжаттар', 'icon' => 'fa fa-gg', 'url' => ['/documents']],
                            ['label' => 'Байланыс', 'icon' => 'fa fa-user', 'url' => ['/about']],
                        ],
                    ],

                    [
                        'label' => 'Оқыту курстар',
                        'icon' => 'nav-icon fa fa-code',
                        'url' => '#',
                        'items' => [
                            ['label' => 'Онлайн оқыту', 'icon' => 'fa fa-user', 'url' => ['/online']],
                            ['label' => 'Офлайн оқыту', 'icon' => 'fa fa-github', 'url' => ['/offline']],
                            ['label' => 'Жылдық жоспар', 'icon' => 'fa fa-gg', 'url' => ['/plan']],
                            ['label' => 'Әдістемелік құралдар', 'icon' => 'fa fa-user', 'url' => ['/methodical']],
                            ['label' => 'Авторлық оқыту', 'icon' => 'fa fa-github', 'url' => ['/author']],
                            ['label' => 'Латын курстар', 'icon' => 'fa fa-gg', 'url' => ['/latin']],
                        ],
                    ],
                    [
                        'label' => 'Өнімдер',
                        'icon' => 'nav-icon fa fa-code',
                        'url' => '#',
                        'items' => [
                            ['label' => 'tilalemi.kz', 'icon' => 'fa fa-user', 'url' => ['/tilalemi']],
                            ['label' => 'atau.kz', 'icon' => 'fa fa-github', 'url' => ['/atau']],
                            ['label' => 'emle.kz', 'icon' => 'fa fa-gg', 'url' => ['/emle']],
                            ['label' => 'termincom.kz', 'icon' => 'fa fa-user', 'url' => ['/termincom']],
                            ['label' => 'qujat.kz', 'icon' => 'fa fa-github', 'url' => ['/qujat']],
                            ['label' => 'tilmedia.kz', 'icon' => 'fa fa-gg', 'url' => ['/tilmedia']],
                            ['label' => 'balatili.kz', 'icon' => 'fa fa-user', 'url' => ['/balatili']],
                            ['label' => 'sozdikqor.kz', 'icon' => 'fa fa-user', 'url' => ['/sozdikqor']],
                            ['label' => 'qazlatyn.kz', 'icon' => 'fa fa-user', 'url' => ['/qazlatyn']],
                            ['label' => 'Тележобалар', 'icon' => 'fa fa-user', 'url' => ['/telejoba']],
                            ['label' => 'Анимация', 'icon' => 'fa fa-user', 'url' => ['/animation']],
                            ['label' => 'Кітаптар', 'icon' => 'fa fa-user', 'url' => ['/books']],
                            ['label' => 'Мобильди қосымшалар', 'icon' => 'fa fa-user', 'url' => ['/apps']],
                        ],
                    ],
                    // [
                    //     'label' => 'Сұрақ-жауап',
                    //     'icon' => 'nav-icon fa fa-code',
                    //     'url' => '/feedback',
                    //     'items' => [
                    //         ['label' => 'FAQ', 'icon' => 'fa fa-user', 'url' => ['/faq']],
                    //     ],
                    // ],

                    ['label' => 'Сұрақ-жауап', 'icon' => 'nav-icon fa fa-code', 'url' => ['/feedback'],],
                    ['label' => 'Gallery', 'icon' => 'fa fa-dashboard', 'url' => ['/gallery'],],



                    [
                        'label' => 'Медиа',
                        'icon' => 'nav-icon fa fa-code',
                        'url' => '#',
                        'items' => [
                            ['label' => 'Бейнехабар', 'icon' => 'fa fa-user', 'url' => ['/beinehabar']],
                            ['label' => 'Галерея', 'icon' => 'fa fa-user', 'url' => ['/gallery']],
                        ],
                    ],

                    ['label' => 'Баспасөз орталығы', 'options' => ['class' => 'header']],
                    ['label' => 'Сабақтар үлгісі', 'icon' => 'fa fa-dashboard', 'url' => ['/adis'],],

                    ['label' => 'Баспасөз орталығы', 'options' => ['class' => 'header']],
                    ['label' => 'БАҚ біз туралы', 'icon' => 'fa fa-dashboard', 'url' => ['/press'],],


                ],
            ]
        ) ?>

    </section>

</aside>