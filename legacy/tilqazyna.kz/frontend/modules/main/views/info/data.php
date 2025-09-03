
<style>
table {
    line-height: 1.5;
    font-size: 14px;
    border-radius: 10px;
    border-spacing: 0;
    text-align: center;
}
th {
    color: white;
    text-shadow: 0 1px 1px #2D2020;
    padding: 10px 20px;
}
th, td {
    border-style: solid;
    border-width: 0 1px 1px 0;
    border-color: white;
}
th:first-child, td:first-child { text-align: left; }
th:first-child { border-top-left-radius: 10px; }
th:last-child {
    border-top-right-radius: 10px;
    border-right: none;
}
td { padding: 10px 20px; }
tr:last-child td:first-child { border-radius: 0 0 0 10px; }
tr:last-child td:last-child { border-radius: 0 0 10px 0; }
tr td:last-child { border-right: none; }
</style>



<?php 
$data = file_get_contents('https://data.egov.kz/api/v4/opendata-api-uri178/v3?apiKey=06983c57d7fe405494029bfbdf562553');
$courses = json_decode($data, true);

function print_arr($arr) {
    echo '<pre>' . print_r($arr, true) . ' </pre>';
}
?>



<h3 class="news__title" style="text-align:center;"><strong> Тіл саясаты саласындағы іс-шаралар мен семинарлар тізбесі</strong></h3>
<table>
<?php
foreach ($courses as $key=>$item) { ?>

<tr>
    <td><strong>Курстың атауы: </strong><?php echo $item['name2'];?></td>
    <td><strong>Тема курса: </strong><?php echo $item['name'];?></td>
    <td><strong>Место проведения: </strong><?php echo $item['number2'];?></td>
    <td><strong>Период прохождения: </strong><?php echo $item['adress'];?></td>
    <td><strong>Кол-во человек, проходивщие курсы: </strong><?php echo $item['number'];?></td>

<?php } ?>
</tr>
</table>







