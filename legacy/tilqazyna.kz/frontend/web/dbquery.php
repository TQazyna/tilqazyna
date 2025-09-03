<?php 

    $sql = "SELECT id, title, img, date FROM articles WHERE `cat_id` <= '17' AND `online` >= '1' ORDER BY id DESC LIMIT 6";
    $result = $conn->query($sql);

?>