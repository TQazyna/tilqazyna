<?php 
/*
	Rymbek Izgali
	Бұл файлда tilalemi.kz сайтының 
	мобильді қосымшасына арналған 
	API функциялары жинақталған.
*/

	$host = '127.0.0.1';
	$database = 'tilalemi';
	$databasekz = 'tilalemi.kz';
	$username = 'root';
	$password = 'xnx63n';

	$command = 0;
	$category_id = 0;
	$article_id = 0;
	$page_id = 0;

	$command = (isset($_GET['cmd'])) ? intval($_GET['cmd']) : $command;
	$category_id = (isset($_GET['cid'])) ? intval($_GET['cid']) : $category_id;
	$article_id = (isset($_GET['id'])) ? intval($_GET['id']) : $article_id;
	$page_id = (isset($_GET['pid'])) ? intval($_GET['pid']) : $page_id;

	//егер материал тізімі болса
	if ($command === 1) {
		$link = mysqli_connect($host, $username, $password, $database) or die("Ошибка " . mysqli_error($link));
		$linkkz = mysqli_connect($host, $username, $password, $databasekz) or die("Ошибка " . mysqli_error($link));
		mysqli_query($link, 'SET NAMES "utf8"');
		mysqli_query($link, "set character_set_connection=utf8"); 
		mysqli_query($link, "set names utf8");
		
		mysqli_query($linkkz, 'SET NAMES "utf8"');
		mysqli_query($linkkz, "set character_set_connection=utf8"); 
		mysqli_query($linkkz, "set names utf8");
		
		//if (intval($page_id)>0){$page_id=$page_id*15+1;}
		$where = "";
		if ($category_id > 0) {
			$where = "Where `cat_id` = $category_id";
			if ($category_id === 30) {
				$where = "Where `cat_id` in (31, 32, 33, 34)";
			}
		}
		if ($category_id === 15) {
			$sql = "Select * From `books` ";
			$sql = "$sql Order By `id` Desc  Limit $page_id, 10";
		} else {
			$sql = "Select * From `til_news` $where";
			//$sql = "$sql Order By `id` Desc  Limit $page_id, 10";
		}
		//echo $sql;
		//    /var/www/admin/data/www/tilalemi.kz/frontend/web/img
		//`cat_id` in (41, 40, 29, 28, 27, 26, 25)
		$sql = mysqli_query($link, $sql);

		$arr_articles = array();
		$in_count = 0;
		while($row = mysqli_fetch_array($sql)){
			if ($category_id === 15) {
				$created = $row['link'];
			} else {
				$created = date("Y-m-d", strtotime($row['date']));
			}
			/*
			$arr_articles[] = array(
				'id'=>$row['id'],
				'title'=>$row['title'],
				'created'=>$created, 
				'image'=>"http://tilalemi.kz".$row['img']);
				*/

			if ($in_count==0) {
				echo 'Insert Into `til_news` Value(id, title, alias, catid, intro_text, full_text, created, hits, rating, media)' . "\r\n";
			}
			$sql_text = '';
			$sql_text = $sql_text . "(" . $row['id'] . ", ";
			$sql_text = $sql_text . "'" . $row['title'] . "', ";
			$sql_text = $sql_text . "'" . $row['preview'] . "', "; //alias
			$sql_text = $sql_text . "2, "; //catid
			$sql_text = $sql_text . "'" . $row['prev'] . "', "; //intro_text
			$sql_text = $sql_text . "'" . $row['text'] . "', "; //full_text
			
			$created = date("Y-m-d H:i:s", strtotime($row['date']));
			$sql_text = $sql_text . "'" . $created . "', "; //created
			$sql_text = $sql_text .  $row['views'] . ", "; //hits
			$sql_text = $sql_text . "'" .  $row['rating'] . "', "; //rating
			//$sql_text = $sql_text . "'" .  $row['rating'] . "', "; //rating
			$sql_text = $sql_text . "'<iframe class=\"ql-video\" frameborder=\"0\" allowfullscreen=\"true\" src=\"" .  $row['link'] . "\"></iframe>'), "; //media
			echo $sql_text . "\r\n";
			if ($in_count==250) {
				$in_count=0;
			}
			$in_count ++;
			
		}
		//echo json_encode($arr_articles);
		//echo $in_count;
		mysqli_close($link);
	}
	
	if ($command === 2) {
		$link = mysqli_connect($host, $username, $password, $database) or die("Ошибка " . mysqli_error($link));
		mysqli_query($link, 'SET NAMES "utf8"');
		mysqli_query($link, "set character_set_connection=utf8"); 
		mysqli_query($link, "set names utf8");
		if (intval($page_id)>0){$page_id=$page_id*15+1;}

		$where = "Where `id` = $article_id";

		if ($category_id === 15) {
			$sql = "Select * From `books` $where";
			$sql = "$sql ";
		} else {
		$sql = "Select * From `til_news` $where";
		$sql = "$sql";
		}
		//echo $sql;
		$sql = mysqli_query($link, $sql);

		$arr_articles = array();
		while($row = mysqli_fetch_array($sql)){
			if ($category_id === 15) {
				$created = "";
				$author = $row['link'];
			} else {
				$created = date("Y-m-d", strtotime($row['date']));
				$author = $row['author'];
			}
			$arr_article_id[] = array(
				'title'=>$row['title'], 
				'author'=>$author,
				'created'=>date("Y-m-d H:i", strtotime($row['date'])), 
				'intro_text'=>$row['prev'], 
				'full_text'=>$row['text'], 
				'image'=>"http://tilalemi.kz".$row['img']);
		}
		echo json_encode($arr_article_id);
		mysqli_close($link);

	}

	if ($command === 3) {
		// "send message";
	}
