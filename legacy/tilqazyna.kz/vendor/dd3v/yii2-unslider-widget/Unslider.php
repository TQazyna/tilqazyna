<?php
namespace dd3v\unslider;

use yii\base\Widget;
use yii\helpers\Html;
use yii\helpers\Json;
use dd3v\unslider\UnsliderAsset;

/**
 * Wrapper for Unslider jQuery plugin
 * ```php
 * use dd3v\unslider\Unslider;
 * echo Unslider::widget([
 *     'options' => [
 *         'dots' => false,
 *         'keys' => true,
 *         'fluid' => true
 *      ],
 *      'slides' => [
 *           [
 *               'img' => 'http://unslider.com/img/sunset.jpg',
 *               'title' => 'Yii PHP Framework',
 *               'body' => 'Unslider widget for Yii 2',
 *               'button' => ['title' => 'Download', 'href' => '#help', 'class' => 'btn']
 *           ],
 *           [
 *               'img' => 'http://unslider.com/img/subway.jpg',
 *               'title' => 'Another image',
 *               'body' => 'description',
 *               'button' => ['title' => 'Download', 'href' => '#help', 'class' => 'btn']
 *           ]
 * ]]);
 *```
 *
 * @author Magalyas Dmitriy <dmitriy.d3v@gmail.com>
 */
class Unslider extends Widget
{
    public $selector = 'banner';
    public $slides = [];
    public $options = [
        'dots' => true,
        'keys' => false,
        'fluid' => true
    ];

    public function init()
    {
        parent::init();
    }

    public function run()
    {
        $this->registerAssets();

        $slider = Html::beginTag('div', ['class' => $this->selector]);
        $slider .= Html::beginTag('ul');
        foreach ($this->slides as $slide) {
            $slider .= '<li style="background-image: url(' . $slide['img'] . ')">';
            $slider .= Html::beginTag('div', ['class' => 'inner']);
            $slider .= isset($slide['title']) ? Html::tag('h1', $slide['title']) : null;
            $slider .= isset($slide['body']) ? Html::tag('p', $slide['body']) : null;
            $slider .= isset($slide['button']) ? Html::a($slide['button']['title'], $slide['button']['href'],
                ['class' => $slide['button']['class']]) : null;
            $slider .= Html::endTag('div');
            $slider .= '</li>';
        }
        $slider .= Html::endTag('ul');
        $slider .= Html::endTag('div');

        return $slider;
    }

    protected function registerAssets()
    {
        $view = $this->getView();
        UnsliderAsset::register($view);
        $options = Json::encode($this->options);
        $view->registerJs("jQuery('.$this->selector').unslider($options);");
    }
}