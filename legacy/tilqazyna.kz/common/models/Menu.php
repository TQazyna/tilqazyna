<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "words".
 *
 * @property integer $id
 * @property string $text
 * @property string $author
 */
class Menu extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'menu';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['text', 'title'], 'required'],
            [['title', 'text'], 'string'],
            [['category'], 'integer'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'text' => 'Текст',
            'title' => 'Название страницы',
        ];
    }
}
