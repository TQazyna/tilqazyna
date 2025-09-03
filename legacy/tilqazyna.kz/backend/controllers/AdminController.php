<?php

namespace backend\controllers;
use yii\filters\AccessControl;

class AdminController extends \yii\web\Controller
{
    public function behaviors()
    {

        return [
            'access' => [
                'class' => AccessControl::className(),
                'rules' => [
                    [
                        'allow' => true,
                        'roles' => ['admin'],
                    ],
                ],
                'denyCallback' => function ($rule, $action) {
                    AdminController::redirectToOwnerPage();
                }
            ],
        ];


    }
    public static function redirectToOwnerPage(){


        if(\Yii::$app->user->can('admin')){
            return Yii::$app->getResponse()->redirect('/admin');
        }else{
            \Yii::$app->user->logout();
            return \Yii::$app->getResponse()->redirect('/admin');
        }
    }

}
