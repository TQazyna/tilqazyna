<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "feedback".
 *
 * @property integer $id
 * @property string $name
 * @property string $lastname
 * @property string $email
 * @property string $tel
 * @property string $role
 * @property string $date
 */
class Feedback extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'feedback';
    }
    public static function  sendEmail($email,$name="",$subject,$body)
    {
        $headers= "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=utf-8\r\n";
        $headers .= "From: Tenge - Астана ломбард admin@lombardtenge.kz\r\n";
        $headers .= "Reply-To: admin@lombardtenge.kz\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        mail($email, $subject, $body, $headers);
    }
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name', 'email', 'role', 'text'], 'string', 'max' => 255],
            [['lastname', 'tel', 'date'], 'string', 'max' => 123]
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
            'lastname' => 'Фамилия',
            'email' => 'Email',
            'tel' => 'Номер телефона',
            'role' => 'Роль на портале',
            'date' => 'Дата семинара',
            'text' => 'Текст',
        ];
    }
}
