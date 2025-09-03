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
class Info extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public function beforeSave($insert)
    {
        if (parent::beforeSave($insert)) {
            $this->alias = Yii::$app->MyLib->translit($this->title);

            return true;
        }
        return false;
    }
    public static function tableName()
    {
        return 'info';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['title'], 'required'],
            [['text'], 'string'],
            [['title', 'alias'], 'string', 'max' => 255]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'title' => 'Название страницы',
            'text' => 'Содержание',
            'alias' => 'Название ссылки',
        ];
    }
}
