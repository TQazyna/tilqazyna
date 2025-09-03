<?php 

namespace common\models;
use Yii;
use yii\db\ActiveRecord;
use yii\db\Connection;
 
class Tilalemi extends ActiveRecord
{
    public static function getDb(){
       return \Yii::$app->db1;
    }

    public static function tableName()
    {
        return 'articles';
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