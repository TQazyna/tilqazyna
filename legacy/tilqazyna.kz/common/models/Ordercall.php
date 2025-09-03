<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "ordercall".
 *
 * @property integer $id
 * @property string $name
 * @property string $tel
 * @property string $email
 */
class Ordercall extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'ordercall';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name', 'tel'], 'required','message'=>'Поле "{attribute}" должно быть заполнено.'],
            [['name'], 'string', 'max' => 255],
            [[ 'tel'], 'integer','message'=>'Введите корректный номер.'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Имя',
            'tel' => 'Контактный телефон',
        ];
    }
}
