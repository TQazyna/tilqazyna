<?php

namespace backend\models;

use Yii;

/**
 * This is the model class for table "comments".
 *
 * @property integer $id
 * @property integer $author_id
 * @property string $text
 * @property string $date
 */
class Comments extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */

    public static function tableName()
    {
        return 'comments';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            //[[ 'text','captcha'], 'required','message'=>'Заполните поле.'],
            [['moder'], 'integer'],
            //['captcha', 'captcha','captchaAction'=>'main/site/captcha','message'=>'Неверный код!.'],
            //[['text'], 'string', 'max' => 500],
            //[['content_type'], 'string'],
            //[['date'], 'string', 'max' => 255]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'author_id' => 'Автор',
            'text' => 'Сообщение',
            'moder' => 'Опубликовано',
            'date' => 'Дата',
        ];
    }
}
