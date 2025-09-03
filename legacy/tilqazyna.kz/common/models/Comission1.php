<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "info".
 *
 * @property integer $id
 * @property string $title
 * @property string $text
 * @property string $alias
 */
class Comission extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
   
    public static function tableName()
    {
        return 'comission';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name', 'prev', 'text', 'email'], 'required'],
            [['text', 'name', 'prev', 'text', 'email'], 'string'],
            [['name', 'email'], 'string', 'max' => 255]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Ф.И.О комиссии',
            'prev' => 'Краткое содержание',
            'text' => 'Полное содержание',
            'email' => 'Электронная почта',
            'img' => 'Изображение',
            'file' => 'Изображение',
        ];
    }
}
