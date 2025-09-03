<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "banners".
 *
 * @property integer $id
 * @property string $title
 * @property string $img
 * @property string $pos
 * @property string $link
 * @property integer $type
 */
class Banners extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public $file;
    public static function tableName()
    {
        return 'banners';
    }
    public function beforeSave($insert)
    {
        if (parent::beforeSave($insert)) {
            /*if($this->pos == 'main_top'){
                $this->posname = "Главная сверху";
            }elseif($this->pos == 'main_bottom'){
                $this->posname = "Главная снизу";
            }elseif($this->pos == 'enter_top'){
                $this->posname = "Внутренная справа";
            }elseif($this->pos == 'enter_bottom'){
                $this->posname = "Внутренная внизу";
            }*/
			$this->posname = self::$posList[$this->pos];

            return true;
        }
        return false;
    }
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['title'], 'required'],
            [['views', 'published'], 'integer'],
            [['title','posname','type', 'img', 'pos', 'link'], 'string', 'max' => 255]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'title' => 'Название',
            'file' => 'Файл',
            'img' => 'Файл',
            'pos' => 'Позиция',
            'order' => 'Сортировка',
            'posname' => 'Позиция',
            'link' => 'Ссылка на сайт',
            'type' => 'Тип',
            'published' => 'Опубликовано',
        ];
    }
	
	public static $posList = [
		'main_top'=>'Главная сверху',
		'main_right'=>'Главная справа',
		'main_bottom'=>'Главная снизу',
		'inner_top'=>'Внутренняя сверху',
		'inner_right'=>'Внутренняя справа',
		'inner_bottom'=>'Внутренняя внизу'
	];
	
	public static $sizeList = [
		'main_top'=>['width'=>'1290', 'height'=>'auto'],
		'main_right'=>['width'=>'300', 'height'=>'auto'],
		'main_bottom'=>['width'=>'1290', 'height'=>'auto'],
		'inner_top'=>['width'=>'1290', 'height'=>'auto'],
		'inner_right'=>['width'=>'240', 'height'=>'400'],
		'inner_bottom'=>['width'=>'1290', 'height'=>'auto']
    ];

    public static $position = [
		'0'=>'Первый',
		'1'=>'Второй',
		'2'=>'Третьий',
		'3'=>'Четвертый',
		'4'=>'Пятый',
        '5'=>'Шестой',
        '6'=>'Седьмой',
        '7'=>'Восьмой',
        '8'=>'Девятый',
        '9'=>'Десятый',
	];
}
