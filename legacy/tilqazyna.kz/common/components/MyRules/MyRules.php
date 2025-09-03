<?php
namespace common\components\MyRules;

use common\models\Category;
use yii\web\UrlRuleInterface;
use yii\base\Object;

class MyRules extends Object implements UrlRuleInterface
{
    public function parseRequest($manager, $request)
    {
        $pathInfo = $request->getPathInfo();


            // Ищем совпадения $matches[1] и $matches[3]
            // с данными manufacturer и model в базе данных
            // Если нашли, устанавливаем $params['manufacturer'] и/или $params['model']
            // и возвращаем ['car/index', $params]

        $cats = Category::find()->all();
        foreach ($cats as $cat) {
            if($cat['alias'] == $pathInfo){
                $params['id'] = $cat['id'];
                return ['main/cats',$params];
            }
        }
        return false;  // данное правило не применимо
    }
    public function createUrl($manager, $route, $params)
    {


        if ($route === 'main/cats') {
            if (isset($params['id'])) {
                return $params['id'];
            }
        }
        return false;  // данное правило не применимо
    }
}