# yii2-unslider-widget
Fluid, flexible, fantastically minimal slider widget for Yii 2

![screenshot](https://raw.githubusercontent.com/dd3v/yii2-unslider-widget/master/screen.jpg)

Installation
------------

Add the following to `require` section of your `composer.json`:

```
dd3v/yii2-unslider-widget": "*"
```

and run `composer install`.

Usage
-----

```php
  use dd3v\unslider\Unslider;
  echo Unslider::widget([
      'options' => [
          'dots' => false,
          'keys' => true,
          'fluid' => true
       ],
       'slides' => [
            [
                'img' => 'http://unslider.com/img/sunset.jpg',
                'title' => 'Yii PHP Framework',
                'body' => 'Unslider widget for Yii 2',
                'button' => ['title' => 'Download', 'href' => '#help', 'class' => 'btn']
            ],
            [
                'img' => 'http://unslider.com/img/subway.jpg',
                'title' => 'Another image',
                'body' => 'description',
                'button' => ['title' => 'Download', 'href' => '#help', 'class' => 'btn']
            ]
  ]]);

```
