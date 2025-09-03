<?php

namespace app\modules\main\controllers;

use common\models\Reg;
use frontend\models\ContactForm;
use common\models\LoginForm;
use yii\base\Response;
use yii\helpers\Url;
use yii\web\Controller;
use yii\web\UploadedFile;
use yii\web\UrlManager;
use yii\widgets\ActiveForm;
use frontend\components\Common;
use Yii;

use yii\filters\AccessControl;


class RegController extends Controller
{
    public $layout = "bootstrap";

    public function actionIndex()
    {
        $model = new Reg();   
        if ($model->load(Yii::$app->request->post())) {
            $file = UploadedFile::getInstance($model, 'file');
            if (!$file) {
                // Файл не загружен
                Yii::$app->session->setFlash('error', 'Файл жүктеу қажет');
                return $this->render('index', ['model' => $model]);
            }

            if ($file->tempName && $model->validate()) {
                $rand = rand(100000, 9000000);
                $dir = Yii::getAlias('@frontend/web/document/');
                $dir2 = Yii::getAlias('document/');
                $fileName = $rand . '.' . $file->extension;
                $filePath = $dir . $fileName;
                if ($file->saveAs($filePath)) {
                    $model->file = '/'.$dir2 . $fileName;
                    if ($model->save()) {
                        return $this->redirect(['success']);
                    } else {
                        // Ошибка сохранения модели
                        Yii::$app->session->setFlash('error', 'Операцияны орындау кезінде қате кетті');
                    }
                } else {
                    // Ошибка сохранения файла
                    Yii::$app->session->setFlash('error', 'Файл сақталмады.');
                }
            } else {
                // Валидация не пройдена
                Yii::$app->session->setFlash('error', 'Валидациялау кезенде қате кетті.');
            }
        }
        
        return $this->render('index', ['model' => $model]);
    }

    public function actionSuccess()
    {
        return $this->render('success');
    }

}
