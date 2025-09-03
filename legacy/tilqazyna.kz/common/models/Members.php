<?php

namespace common\models;

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
    /**
     * @inheritdoc
     */
    public $file1;
    public $file2;
    public $file3;
    public $file4;
    public $file5;
    public static function tableName()
    {
        return 'members';
    }

    /**
     * @inheritdoc
     */
    public function beforeSave($insert)
    {
        if (parent::beforeSave($insert)) {
                $lastmember = Members::find()->orderBy('id desc')->one();
                $id = $lastmember['id'];
                $id2 = $id+1;
                $name = $this->name;
                $email = $this->email;
                    $message = "Здравствуйте, $name , благодарим Вас за участие в конкурсе \"Наши чудесные Леди\", чтобы посмотреть набранные голоса  пройдите по  <a href=http://happyme.kz/concurse/member/$id2>этой ссылке</a><br>С уважением,  happyme.kz.";


            $headers= "MIME-Version: 1.0\r\n";
                    $headers .= "Content-type: text/html; charset=utf-8\r\n";
                    $headers .= "From: Happyme.kz <info@happyme.kz>\r\n";
                    $headers .= "Reply-To: info@happyme.kz\r\n";
                    $headers .= "X-Mailer: PHP/" . phpversion();


                    mail($email, "Участие в конкурсе", $message,$headers);


            return true;
        }
        return false;
    }
    public function rules()
    {
        return [
            [['name', 'email', 'city', 'text'], 'required','message' => 'Заполните поле.'],
            [['file1','file2','file3','file4','file5'], 'file', 'extensions' => 'png, jpg','message' => 'Загрузите jpg или png.'],
            [['text'], 'string'],
            [['name','other', 'email', 'city', 'img1', 'img2', 'img3', 'img4', 'img5'], 'string', 'max' => 255]
        ];
    }

    /**
     * @inheritdoc
     */
    public function saveMember(){

    }
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Ваше имя',
            'email' => 'Email',
            'moder' => 'Опубликовано',
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
