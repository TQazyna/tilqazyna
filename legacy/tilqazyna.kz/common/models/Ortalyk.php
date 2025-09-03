<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "ortalyk".
 *
 * @property integer $id
 * @property string $title
 * @property string $adres
 * @property string $tel
 * @property string $email
 * @property string $site
 * @property string $fax
 * @property string $tel2
 */
class Ortalyk extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'ortalyk';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['title'], 'required'],
            [['title', 'adres'], 'string', 'max' => 500],
            [['tel', 'email', 'site', 'fax', 'tel2','direktor','obl', 'type'], 'string', 'max' => 255],
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
            'adres' => 'Адрес',
            'tel' => 'Телефон',
            'email' => 'Email',
            'site' => 'Сайт',
            'fax' => 'Факс',
            'tel2' => 'Телефон 2',
            'obl' => 'Область',
            'type' => 'Тип',
            'direktor' => 'Директор',
        ];
    }
}
