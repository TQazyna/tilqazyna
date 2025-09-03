<?php
$this->title = 'Tiл Қазына - Бақ';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="orta-page news-page">
    <div class="main-page__in floated">
        <div class="main-page__center">
            <div class="orta-page__in">

                <h1>Бақ</h1>

                <div class="">

                    <table border="1" width="100%">

                        <tr>
                            <th style="border-bottom: 1px solid #ccc;">Атауы</th>
                            <th style="border-bottom: 1px solid #ccc;"></th>
                        </tr>
                        <?php foreach ($art as $art) { ?>
                        <tr>
                            <td width="92%">
                                <div class="press_text">
                                    <a href="/pressarticle/<?php echo $art['id']?>"><?php echo $art['title']?></a><span
                                        style="padding-left: 0 25px;">
                                </div>
                            </td>
                            <td width="8%"></td>
                        </tr>
                        <?php 
                    }
                    ?>

                    </table>


                </div>

            </div>
        </div>
    </div>
</div>

<style>
.press_text {
    padding-right: 15px;
}

tbody {
    font-size: 16px;
}

tr td {
    border: none;
}

tbody {
    border-color: transparent;
}
</style>