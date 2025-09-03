<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "books".
 *
 * @property integer $id
 * @property string $title
 * @property string $text
 * @property string $img
 */
class Books extends \yii\db\ActiveRecord
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
        return 'event';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['title', 'text'], 'required'],
            [['title', 'text'], 'string'],
            //[['title', 'author', 'img', 'link','online_text','pdf_link'], 'string', 'max' => 255],
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
            'text' => 'Описание',
            'img' -> 'Изображение',
        ];
    }
}
