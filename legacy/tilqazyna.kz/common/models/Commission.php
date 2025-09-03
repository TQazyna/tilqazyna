<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "articles".
 *
 * @property integer $id
 * @property string $title
 * @property string $preview
 * @property string $text
 * @property string $img
 * @property integer $online
 * @property integer $onslider
 * @property string $date
 * @property string $author
 * @property integer $views
 * @property integer $conc
 */
class Commission extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public $file;
    public $file2;
    public $file3;
    public function beforeSave($insert)
    {
        if (parent::beforeSave($insert)) {
            //$this->preview = Yii::$app->MyLib->translit($this->title);
            if(empty($this->date) or $this->date == '0000-00-00'){
                $this->date = date("j.n.Y");
            }
            
            if(!empty($this->time)){
                $time = $this->time;
                $time = explode(':',$time);
                $h = $time[0];
                $m = $time[1];
                $s = 0;
            }else{
                $h = 0;
                $m = 0;
                $s = 0;
            }

            if(!empty($this->date)){
                $date = $this->date;
                $date = explode('.',$date);
                $d = $date[0];
                $mon = $date[1];
                $y = $date[2];
                $this->orders = mktime($h,$m,$s,$mon,$d,$y);
            }


            return true;
        }
        return false;
    }
    public static function tableName()
    {
        return 'comission';
    }
    public static function preview($text)
    {
        $preview = explode(" ",strip_tags($text));
        $result = '';
        $i = 0;
        foreach ($preview as $item) {
            if($i>12) break;
            $result = $result." ".$item;
            $i++;
        }
        return $result;
    }
    public static function getCatById($id)
    {
        return $cat = Category::findOne($id);
    }


    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['title'], 'required'],
            [['title', 'text','prev', 'email'], 'string'],
            [['online', 'views', 'orders'], 'integer'],
            [['date'], 'safe'],
            //[['file','file2'], 'file'],
            [['img', 'cat'], 'string', 'max' => 255],
            //['time', 'default', 'value' => '00:00'],
            
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'title' => 'ФИО комисии',
            'prev' => 'Короткое описание',
            'text' => 'Содержание',
            'img' => 'Изображение',
            'file' => 'Изображение',
            'file2' => 'Изображение для слайдера',

            'online' => 'Опубликовано',
            'date' => 'Дата',
            'author' => 'Автор',
            'views' => 'Просмотры',
            'time' => 'Время',
			
        ];
    }
}
