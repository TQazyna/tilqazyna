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
class Words extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'words';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['text', 'author'], 'required'],
            [['text', 'author'], 'string', 'max' => 255]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'text' => 'Цитата',
            'author' => 'Автор',
        ];
    }
}
