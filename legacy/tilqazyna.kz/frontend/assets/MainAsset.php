<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace frontend\assets;

use yii\web\AssetBundle;
use yii\web\View;

/**
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class MainAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/style.css',
        'css/owl.carousel.css',
        //'css/owl.theme.css',
        //'css/cabinet.css',

    ];
    public $js = [
        'js/main.js',
        'js/slick.min.js',
        'js/owl.carousel.js',
        /* 'js/headhesive.min.js', */
        'js/menu.js'
    ];
    public $depends = [
        'yii\web\YiiAsset',
        // 'yii\web\JqueryAsset',
    ];
    //public $jsOptions = ['position' => \yii\web\View::POS_HEAD];
}
