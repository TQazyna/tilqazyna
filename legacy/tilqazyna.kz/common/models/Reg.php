<?php

namespace common\models;
use common\models\Conference;
use Yii;

class Reg extends \yii\db\ActiveRecord
{

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'register';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            // [['title', 'article', 'fio','country', 'position','tel', 'email','cert'], 'required',  'message'=>'Міндетті түрде толтыру қажет'],
            [['title', 'article', 'fio','country', 'position','tel', 'cert', 'category'], 'string'],
            // [['file'], 'file', 'skipOnEmpty' => false, 'extensions' => 'doc, docx, pdf', 'message' => 'Мақалаңыз doc, docx немесе PDF форматында жүктеп алыңыз.'],
			[['email'], 'trim'],
            [['title', 'article'], 'safe'],
			['email', 'email'],	
			
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'id',
            'title' => 'Конференцияны таңдаңыз',
            'article' => 'Мақала атауы',
            'fio' => 'Аты-жөні',
            'country' => 'Мемлекет атауы',
            'position' => 'Оқу/жұмыс орын атауы, лауазымы, ғылыми дәрежесі',
            'tel' => 'Байланыс телефоны',
            'email' => 'email',
            'cert' => 'Сертификат',
            'file' => 'Нұсқасы',
            'category'=>'Секция'
        ];
    }
	
}
