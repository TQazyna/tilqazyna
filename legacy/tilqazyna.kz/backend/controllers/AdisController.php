<?php

namespace backend\controllers;

use common\models\Category;
use common\models\User;
use Yii;
use common\models\Adis;
use yii\data\ActiveDataProvider;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\web\UploadedFile;

class AdisController extends AdminController
{
    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'delete' => ['post'],
                ],
            ],
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


    /**
     * Lists all Adis models.
     * @return mixed
     */
    public function actions()
    {
        return [
            'image-upload' => [
                'class' => 'vova07\imperavi\actions\UploadAction',
                'url' => '/img/art/', // Directory URL address, where files are stored.
                'path' => '@frontend/web/img/art/' // Or absolute path to directory where files are stored.
            ],
        ];
    }
    public function actionIndex()
    {
        $dataProvider = new ActiveDataProvider([
            'query' => Adis::find()->where(['cat_id'=>11])->orderBy("id desc"),
        ]);

        return $this->render('index', [
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays a single Adis model.
     * @param integer $id
     * @return mixed
     */
    public function actionView($id)
    {
        return $this->render('view', [
            'model' => $this->findModel($id),
        ]);
    }

    /**
     * Creates a new Adis model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */

    public function actionCreate()
    {
        $model = new Adis();
        if ($model->load(Yii::$app->request->post())) {
            $file = UploadedFile::getInstance($model, 'file');
            if ($file && $file->tempName) {
                $model->file = $file;
                if ($model->validate(['file'])) {

                    $rand = rand(100000,9000000);

                    $dir = Yii::getAlias('@frontend/web/img/articles/');
                    $dir2 = Yii::getAlias('img/articles/');
                    $fileName = $rand . '.' . $model->file->extension;
                    $model->file->saveAs($dir . $fileName);
                    $model->file = $fileName; // без этого ошибка
                    $model->img = '/'.$dir2 . $fileName;
                }
            }
            if($model->save()){
                return $this->redirect(['view', 'id' => $model->id]);
            }
        }else {
            return $this->render('create', [
                'model' => $model,'category' => Category::find()->all(),
            ]);
        }

    }

    /**
     * Updates an existing Articles model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id
     * @return mixed
     */
    public function actionUpdate($id)
    {
        $model = $this->findModel($id);

        if ($model->load(Yii::$app->request->post()) ) {
            $current_image = $model->img;
            $file = UploadedFile::getInstance($model, 'file');
            if ($file && $file->tempName) {
                $model->file = $file;
                if ($model->validate(['file'])) {


                    $rand = rand(100000,9000000);
                    $dir = Yii::getAlias('@frontend/web/img/articles/');
                    $dir2 = Yii::getAlias('img/articles/');
                    $fileName = $rand . '.' . $model->file->extension;
                    $model->file->saveAs($dir . $fileName);
                    $model->file = $fileName; // без этого ошибка
                    $model->img = '/'.$dir2 . $fileName;

                }
            }
            $current_image2 = $model->img_slider;
            $file2 = UploadedFile::getInstance($model, 'file2');
            if ($file2 && $file2->tempName) {
                $model->file2 = $file2;
                if ($model->validate(['file2'])) {

                    if(!empty($current_image2) and file_exists(Yii::getAlias('@frontend/web/'.$current_image2)))
                    {
                        //удаляем файл
                        unlink(Yii::getAlias('@frontend/web/'.$current_image2));
                        $model->img_slider = '';
                    }


                    $rand = rand(100000,9000000);
                    $dir = Yii::getAlias('@frontend/web/img/articles/');
                    $dir2 = Yii::getAlias('img/articles/');
                    $fileName = $rand . '.' . $model->file2->extension;
                    $model->file2->saveAs($dir . $fileName);
                    $model->file2 = $fileName; // без этого ошибка
                    $model->img_slider = '/'.$dir2 . $fileName;

                }
            }

            if($model->save()){
                return $this->redirect(['view', 'id' => $model->id]);
            }
        } else {
            return $this->render('update', [
                'model' => $model,'category'=>Category::find()->all()
            ]);
        }
    }

    /**
     * Deletes an existing Adis model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param integer $id
     * @return mixed
     */
    public function actionDelete($id)
    {
        $this->findModel($id)->delete();

        return $this->redirect(['index']);
    }

    /**
     * Finds the Adis model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @return Adis the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        if (($model = Adis::findOne($id)) !== null) {
            return $model;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }
}
