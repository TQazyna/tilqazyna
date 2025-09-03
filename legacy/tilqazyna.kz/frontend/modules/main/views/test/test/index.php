<meta charset="UTF-8">
<?php
use ckarjun\owlcarousel\OwlCarouselWidget;
use dd3v\unslider\Unslider;
use yii\bootstrap\Tabs; 

$this->title = 'Шайсұлтан Шаяхметов атындағы «Тіл Қазына» ұлттық ғылыми-практикалық орталығы';

?>



<div class="main-page">
    <div class="main-page__in floated">
        <div class="slider">
            <link rel="stylesheet" href="/slides/slides.css">
            <div id="app"></div>
            <script src='https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react.min.js'></script>
            <script src='https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react-dom.min.js'></script>
            <script src='https://cdnjs.cloudflare.com/ajax/libs/classnames/2.2.5/index.min.js'></script>
            <script src="/slides/slides.js"></script>
        </div>

    <!-- <div class="main-page__tolganys__title-b">
            <a href=""><h2 class="main-page__tolganys__title">Жаңалықтар</h2></a>
            <div class="main-page__tolganys__sections"></div>
        </div> -->

    <div class="news">

    <?php
    $servername = "localhost";
    $username = "root";
    $password = "xnx63n";
    $dbname = "tilalemi";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    mysqli_set_charset($conn, "utf8"); /* Procedural approach */
    $conn->set_charset("utf8");        /* Object-oriented approach */
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT id, title, img, data FROM articles ORDER BY id DESC LIMIT 3";
    $result = $conn->query($sql);

    ?>


    <section id="news" class="news">
        <h1>Жаңалықтар</h1>
        <div class="card-deck news-box evgd-news-main">
            <?php if ($result->num_rows > 0) { 
                while($row = $result->fetch_assoc()) {?>
            <div class="card evgd-news-card">
                <a href="https://tilalemi.kz/article/<?php echo $row['id']?>" class="card-link">
                    <img src="https://tilalemi.kz/<?php echo $row['img']?>" alt="<?php echo $row['title']?>" class="card-img-top">
                </a>
                <div class="card-body">
                    <a href="https://tilalemi.kz/article/<?php echo $row['id']?>" class="card-link">
                        <h5 class="card-title"><?php echo $row['title']?></h5>
                    </a>
                </div>
                <div class="card-footer bg-transparent">
                    <a href="https://tilalemi.kz/article/<?php echo $row['id']?>" class="card-link">Толығырақ <i class="fa fa-long-arrow-right"></i></a>
                    <span class="date-news"></span> <!-- <?php //echo $new['date'] ?>-->
                </div>
            </div>
            <?php } } $conn->close();?>
        </div> 
        <a href="/news" class="all-news"><img src="/img/padnote.png" alt="...">Барлық жаңалықтар</a>
    </section>


    







       
        <div class="main-page__tolganys__items floated">
        
    </div>


    <div class="infographic" style="display:none;">
    <h2 class="main-page__tolganys__title">infographic</h2>
    <?php echo Tabs::widget([
        'items' => [
        ]
    ]);

    ?>

    </div>






</div>

