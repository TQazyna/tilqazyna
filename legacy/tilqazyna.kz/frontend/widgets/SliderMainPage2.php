<?php

namespace frontend\widgets;

use common\models\Articles;
use common\models\Category;
use yii\bootstrap\Widget;
use yii\imagine\Image; 
use Imagine\Image\Box;
use Imagine\Image\Point;

class SliderMainPage2 extends  Widget{

	public $limit;
	public $template;

	public function init(){
		parent::init();
		if ($this->limit == null){
			$this->limit = 5;
		}
		if ($this->template == null){
			$this->template = 'sliderMainPage';
		}
	}
	
    public function run(){
		
		if (isset($_SESSION['sait']) && $_SESSION['sait'] == "ar") {
			return '';
		}

        $slides = Articles::find()->where(["onslider"=>1])
			->orderBy("id desc")->limit((int)$this->limit)->all();

		foreach($slides as $slide) {
			if (! file_exists('../web/img_960_400' . $slide->img) && $slide->img) {
				$imagine = Image::getImagine();

				$filename = $slide->img_slider ? $slide->img_slider : $slide->img;
				if (! preg_match('/(.png|.jpg)/', $filename) || !file_exists('../web' . $filename)) continue;
				$image = $imagine->open('../web' . $filename);
				//$image->resize(new Box(960, 400))->save('../web/img_960_400' . $slide->img, ['quality' => 70]);*/
				
				$size = $image->getSize();
				$ratio = $size->getWidth()/$size->getHeight();
				$width = 960;
				$height = round($width/$ratio);
				$point = ($height - 400) / 2;
				if ($point < 0) $point = 0;
				$box = new Box($width, $height);
				$image->resize($box);
				if ($point > 0)
					$image->crop(new Point(0,$point), new Box(960,400));
				$image->save('../web/img_960_400' . $slide->img, ['quality' => 90]);
			}
		}

		return $this->render('sliderMainPage_v5',['slides'=>$slides]);
    }
}