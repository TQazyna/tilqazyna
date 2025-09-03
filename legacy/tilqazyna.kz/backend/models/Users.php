<?php
namespace backend\models;
use yii\base\Model;
use Yii;

/**
 * Signup form
 */
class Users extends Model
{
    public $password;
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            ['password', 'required'],
            ['password', 'string', 'min' => 6],
        ];
    }

}
