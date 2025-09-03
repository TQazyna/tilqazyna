<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "comments".
 *
 * @property integer $id
 * @property integer $author_id
 * @property string $text
 * @property string $date
 */
class Comments extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public $captcha;
    public function beforeSave($insert)
    {
        if (parent::beforeSave($insert)) {
            if(Yii::$app->user->isGuest){
                $this->author_id = "Аноним";
            }else{
                $this->author_id = Yii::$app->user->identity->username;
            }
            $this->date = date("Y-m-d-G:i");
            $this->content_type = Yii::$app->controller->id;
            $this->content_id = Yii::$app->controller->actionParams['id'];
            if($this->content_type == 'article'){
                $article = Articles::findOne($this->content_id);
                $article->comments ++;
                $article->save();
            }

            return true;
        }
        return false;
    }
    public static function tableName()
    {
        return 'comments';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [[ 'text','captcha'], 'required','message'=>'Заполните поле.'],
            [['author_id','content_id','moder'], 'integer'],
            ['captcha', 'captcha','captchaAction'=>'main/site/captcha','message'=>'Неверный код!.'],
            [['text'], 'string', 'max' => 500],
            [['content_type'], 'string'],
            [['date'], 'string', 'max' => 255]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'author_id' => 'Автор',
            'moder' => 'Опубликовано',
            'text' => 'Сообщение',
            'date' => 'Дата',
        ];
    }
}
