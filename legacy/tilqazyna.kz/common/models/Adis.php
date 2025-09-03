<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "adis".
 *
 * @property integer $id
 * @property string $title
 * @property string $preview
 * @property string $text
 * @property string $img
 * @property string $cat_id
 * @property integer $online
 * @property integer $onblock
 * @property integer $onslider
 * @property string $date
 * @property string $author
 * @property integer $views
 * @property integer $comments
 * @property integer $conc
 */
class Adis extends \yii\db\ActiveRecord
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
            if($this->cat_id !== 11){
                if($this->online == 1){
                    $this->online_text = "Да";
                }else{
                    $this->online_text = "Нет";
                }

                if(!empty($this->author_link) and $this->author_link != 9){
                    $user = User::findOne($this->author_link);

                    $this->author = $user['username']." ".$user['lastname'];
                }
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
        return 'adis';
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
            [['title', 'preview', 'text','prev'], 'string'],
            [['online', 'onblock', 'onslider', 'views', 'comments','author_link','orders','video_cats','subcat_id'], 'integer'],
            [['date'], 'safe'],
            //[['file','file2'], 'file'],
            [['img', 'cat_id', 'author','online_text','conc','cat','time'], 'string', 'max' => 255],
            [['link','audio'], 'string', 'max' => 500],
            ['time', 'default', 'value' => '00:00'],
            
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'title' => 'Заголовок',
            'preview' => 'Короткое описание',
            'prev' => 'Короткое описание',
            'text' => 'Содержание',
            'img' => 'Изображение',
            'file' => 'Изображение',
            'file2' => 'Изображение для слайдера',
            'cat_id' => 'Категория',
            'online' => 'Опубликовано',
            //'onblock' => 'Onblock',
            'onslider' => 'На слайдере',
            'date' => 'Дата',
            'author' => 'Автор',
            'author_link' => 'Ползователь',
            'views' => 'Просмотры',
            'comments' => 'Комментарии',

            'video_cats' => 'Категория видео',
            'link' => 'Ссылка на видео',
            'conc' => 'Теги',
            'cat' => 'Рубрика',
            'time' => 'Время',
			
			'subcat_id' => 'Рубрика',
        ];
    }
}
