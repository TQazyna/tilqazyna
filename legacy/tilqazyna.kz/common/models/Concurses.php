<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "concurses".
 *
 * @property integer $id
 * @property string $title
 * @property string $description
 * @property string $pravila
 * @property string $prizy
 */
class Concurses extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'concurses';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['title', 'description', 'pravila', 'prizy'], 'required'],
            [['description', 'pravila', 'prizy'], 'string'],
            [['title'], 'string', 'max' => 255]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'title' => 'Название конкурса',
            'description' => 'Описание',
            'pravila' => 'Правила',
            'prizy' => 'Призы',
        ];
    }
}
