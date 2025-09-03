<?php

namespace backend\models;

use Yii;

/**
 * This is the model class for table "members".
 *
 * @property integer $id
 * @property string $name
 * @property string $email
 * @property string $city
 * @property string $text
 * @property string $img1
 * @property string $img2
 * @property string $img3
 * @property string $img4
 * @property string $img5
 */
class Members extends \yii\db\ActiveRecord
{

    public function rules()
    {
        return [

            [['moder'], 'integer'],
        ];
    }

    /**
     * @inheritdoc
     */

    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'moder' => 'Опубликовано',
            'name' => 'Ваше имя',
            'email' => 'Email',
            'city' => 'Город',
            'text' => 'Описание',
            'file1' => 'Фотография 1',
            'file2' => 'Фотография 2',
            'file3' => 'Фотография 3',
            'file4' => 'Фотография 4',
            'file5' => 'Фотография 5',
        ];
    }
}
