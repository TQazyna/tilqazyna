<?php

namespace common\models;
use Yii;

class Gallery extends \yii\db\ActiveRecord
{
    public function behaviors()
    {
        return [
            'galleryBehavior' => [
                'class' => GalleryBehavior::className(),
                'type' => 'part',
                'extension' => 'jpg',
                'directory' => Yii::getAlias('@webroot') . '/images/part/gallery',
                'url' => Yii::getAlias('@web') . '/images/part/gallery',
                'versions' => [
                    'small' => function ($img) {
                        /** @var \Imagine\Image\ImageInterface $img */
                        return $img
                            ->copy()
                            ->thumbnail(new \Imagine\Image\Box(200, 200));
                    },
                    'medium' => function ($img) {
                        /** @var \Imagine\Image\ImageInterface $img */
                        $dstSize = $img->getSize();
                        $maxWidth = 800;
                        if ($dstSize->getWidth() > $maxWidth) {
                            $dstSize = $dstSize->widen($maxWidth);
                        }
                        return $img
                            ->copy()
                            ->resize($dstSize);
                    },
                ]
            ]
        ];
    }

    
    /**
     * @inheritdoc
     */
    public $file;
    public $file2;
    public $file3;
    public function beforeSave($insert)
    {
        if (parent::beforeSave($insert)) {
            //$this->preview = Yii::$app->MyLib->translit($this->title);
            if(empty($this->date) or $this->date == '0000-00-00'){
                $this->date = date("j.n.Y");
            }
            if($this->cat_id !== 11){
                if($this->online == 1){
                    $this->online_text = "Да";
                }else{
                    $this->online_text = "Нет";
                }

                if(!empty($this->author_link) and $this->author_link != 9){
                    $user = User::findOne($this->author_link);

                    $this->author = $user['username']." ".$user['lastname'];
                }
            }
            if(!empty($this->time)){
                $time = $this->time;
                $time = explode(':',$time);
                $h = $time[0];
                $m = $time[1];
                $s = 0;
            }else{
                $h = 0;
                $m = 0;
                $s = 0;
            }

            if(!empty($this->date)){
                $date = $this->date;
                $date = explode('.',$date);
                $d = $date[0];
                $mon = $date[1];
                $y = $date[2];
                $this->orders = mktime($h,$m,$s,$mon,$d,$y);
            }


            return true;
        }
        return false;
    }
    public static function tableName()
    {
        return 'gallery';
    }
    public static function preview($text)
    {
        $preview = explode(" ",strip_tags($text));
        $result = '';
        $i = 0;
        foreach ($preview as $item) {
            if($i>12) break;
            $result = $result." ".$item;
            $i++;
        }
        return $result;
    }
    public static function getCatById($id)
    {
        return $cat = Category::findOne($id);
    }


    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['title'], 'required'],
            [['title'], 'string'],
            [['online', 'onslider', 'views'], 'integer'],
            [['date'], 'safe'],
            //[['file','file2'], 'file'],
            [['img'], 'string', 'max' => 255],
            
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'title' => 'Заголовок',
            'img' => 'Изображение',
            'file' => 'Изображение',
            'file2' => 'Изображение для слайдера',
            'online' => 'Опубликовано',
            'onslider' => 'На слайдере',
            'date' => 'Дата',
            'views' => 'Просмотры',
        ];
    }
}
