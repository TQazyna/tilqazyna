<?php
$params = array_merge(
    require(__DIR__ . '/../../common/config/params.php'),
    require(__DIR__ . '/../../common/config/params-local.php'),
    require(__DIR__ . '/params.php'),
    require(__DIR__ . '/params-local.php')
);

return [
    'id' => 'app-frontend',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'controllerNamespace' => 'frontend\controllers',
    'defaultRoute' => 'main/main',
    'modules' => [
        'main' => [
            'class' => 'app\modules\main\Module',
        ],
    ],
    'language' => 'kk-KZ',
    'sourceLanguage' => 'kk-KZ',
    'components' => [
        'request' => [
            'baseUrl' => ''
        ],
        'urlManager' => [
            'class' => 'yii\web\UrlManager',
            'rules' => [
                'baiqau' => 'main/baiqau',
                'photogallery' => 'main/gallery',
                'article/<id>' => 'main/article',
                'pressarticle/<id>' => 'main/pressarticle',
                'adisart/<id>' => 'main/adisart',
                'users/<id>' => 'main/users',
                'tartu/<id>' => 'main/tartu',
                'adis/<cat>/<id>' => 'main/adis',
                'adis/<cat>' => 'main/adis',
                'tolganys/<date>' => 'main/tolganys',
                'tartu/one/<id>' => 'main/tartu/one',
                'constitution' => 'main/constitution',
                'tilzan' => 'main/tilzan',
                'data' => 'main/data',
                'tilsayasat' => 'main/tilsayasat',
                'blogs' => 'main/blogs',
                'about' => 'main/about',
                'info/<id>' => 'main/info',
                'concurse/member/<id>' => 'main/concurse/member',
                'news' => 'main/news',
                'announcements' => 'main/announcements',
                'announcement/<id>' => 'main/announcement',
                'egov' => 'main/egov',
                'logout' => 'main/site/logout',
                'adis' => 'main/adis',
                'memtil' => 'main/program',
                'alash' => 'main/alash',
                'memtil/<id>' => 'main/program',
                'til-rayi' => '/main/til-rayi',
                'uzdik' => '/main/uzdikmakala',
                'tartu' => '/main/tartu',
                'tartu/<action>' => '/main/tartu/<action>',
                'profile/<action>' => '/main/profile/<action>',
                'profile' => '/main/profile',
                'tolganys' => '/main/tolganys',
                'ruhani' => '/main/ruhani',
                'konak-kade' => '/main/konak-kade',
                'orta' => '/main/orta',
                'search' => '/main/search',
                /* 'forum2019' => '/main/main/forum', */
                'baspavideo' => '/main/baspavideo',
                'baspavideos/<id>' => '/main/baspavideos',
                'lang/<id>' => '/main/lang',

                'lessons' => 'main/lessons',
                'lesson/<id>' => 'main/lesson',

                'teachers' => 'main/teachers',
                'teacher/<id>' => 'main/teacher',

                'bailanis' => 'main/bailanis',
                'event' => 'main/info/data',
                'commission/<id>' => 'main/commission',
                'departments' => 'main/departments',
                //'commission' => 'main/commission',

                'register' => '/main/reg',
                '/success' => '/main/reg/success',

                //newsite Tilqazyna 

                'send' => '/main/send',

                // ПОЛИТИКА БЕЗОПАСНОСТИ
                'security-tilqural' => '/main/security/tilqural',
                'security-qazlatyn' => '/main/security/qazlatyn',


                /* menu  */
                'community' => 'main/community',
                'director' => 'main/director',
                'director/basdirector' => 'main/director/basdirector',
                'director/atkdirector' => 'main/director/atkdirector',
                'director/obdirector' => 'main/director/obdirector',
                'director/oddirector' => 'main/director/oddirector',
                
               
                
                

                'documents' => 'main/documents',
                'goszakup' => 'main/goszakup',
                'leaders' => 'main/leaders',
                'directors'=> 'main/structure/directors',

                'structure' => 'main/structure',
                'corpsecretary' => 'main/structure/corpsecretary',
                'atkdirector' => 'main/structure/atkdirector',
                'audit' => 'main/structure/audit',
                'boardofdirectors' => 'main/structure/boardofdirectors',
                'ceosecretary' => 'main/structure/ceosecretary',
                'secretary' => 'main/structure/secretary',

                'deputydirectory' => 'main/structure/deputydirectory',
                'spellingdep' => 'main/structure/spellingdep',
                'methodologydep' => 'main/structure/methodologydep',
                'terminologydep' => 'main/structure/terminologydep',
                'itechnologydep' => 'main/structure/itechnologydep',
                'editorialdep' => 'main/structure/editorialdep',
                'lawdep' => 'main/structure/lawdep',
                'findep' => 'main/structure/findep',


                'ceo' => 'main/structure/ceo',

                'about' => 'main/about',
                'center' => 'main/center',
                'event' => 'main/event',

                'online' => 'main/online',
                'offline' => 'main/offline',
                'plan' => 'main/plan',
                'methodicalaids' => 'main/methodicalaids',
                'authoraids' => 'main/authoraids',
                'latin' => 'main/latin',

                'adisteme' => 'main/adisteme',
                'appinfo' => 'main/appinfo',



                'news' => '/main/news',
                'onimder' => 'main/onim',
                'onimder/atau' => 'main/onimder/atau',
                'onimder/tilalemi' => 'main/onimder/tilalemi',
                'onimder/qazlatyn' => 'main/onimder/qazlatyn',
                'onimder/sozdikqor' => 'main/onimder/sozdikqor',
                'onimder/tilqural' => 'main/onimder/tilqural',
                'onimder/termincom' => 'main/onimder/termincom',
                'onimder/emle' => 'main/onimder/emle',
                'onimder/balatili' => 'main/onimder/balatili',
                'onimder/tilmedia' => 'main/onimder/tilmedia',
                'onimder/qujat' => 'main/onimder/qujat',

                'infographic/qazlatyn' => 'main/infographic/qazlatyn',
                'infographic/sozdikqor' => 'main/infographic/sozdikqor',
                'infographic/termincom' => 'main/infographic/termincom',
                'infographic/tilalemi' => 'main/infographic/tilalemi',






                'ajax/<action:\w+>' => 'main/ajax/<action>',

                'neworta/<cat>/<id>' => 'main/neworta',
                'neworta/<cat>' => 'main/neworta',
                'neworta' => 'main/neworta',

               
            ]
        ],
        'mail' => [
            'class'            => 'zyx\phpmailer\Mailer',
            'viewPath'         => '@common/mail',
            'useFileTransport' => false,
            'config'           => [
                'mailer'     => 'smtp',
                'host'       => 'smtp.yandex.ru',
                'port'       => '465',
                'smtpsecure' => 'ssl',
                'smtpauth'   => true,
                'username'   => '',
                'password'   => '',
            ],
        ],
        'user' => [
            'identityClass' => 'common\models\User',
            'enableAutoLogin' => true,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'errorHandler' => [
            'errorAction' => 'main/main/error',
        ],



    ],
    'params' => $params,
];