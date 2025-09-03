<?php
namespace dd3v\unslider;

use yii\web\AssetBundle;

class UnsliderAsset extends AssetBundle
{
	public $sourcePath = '@dd3v/unslider/assets/';
	public $baseUrl = '';
	public $css = ['css/style.css'];
	public $js = ['src/unslider.js'];
	public $depends = ['yii\web\JqueryAsset'];
} 
?>