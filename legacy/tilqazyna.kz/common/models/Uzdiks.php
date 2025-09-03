<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "books".
 *
 * @property integer $id
 * @property string $title
 * @property string $author
 * @property integer $cat_id
 * @property string $des
 * @property string $img
 * @property string $link
 */
class Uzdiks extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public $file;
    public function beforeSave($insert)
    {
        if (parent::beforeSave($insert)) {
            if($this->online == 1){
                $this->online_text = "Да";
            }else{
                $this->online_text = "Нет";
            }

            /*if(!empty($this->author_link)){
                $user = User::findOne($this->author_link);

                $this->author = $user['username']." ".$user['lastname'];
            }*/


            return true;
        }
        return false;
    }
    public static function tableName()
    {
        return 'usdik';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['title', 'cat_id', 'des'], 'required'],
            [['cat_id','online','author_link','sort','sort_main'], 'integer'],
            [['des'], 'string'],
            [['file'], 'file', 'extensions' => 'png, jpg'],
            [['title', 'author', 'img', 'link','online_text','pdf_link'], 'string', 'max' => 255],
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
            'author' => 'Автор',
            'cat_id' => 'Категория',
            'des' => 'Описание',
            'img' => 'Изображение',
            'file' => 'Изображение',
            'link' => 'Ссылка на источник',
            'online' => 'Опубликовать',
            'online_text' => 'Опубликовано',
            'sort' => 'Порядок',
            'sort_main' => 'Порядок главной страницы',
        ];
    }
}
