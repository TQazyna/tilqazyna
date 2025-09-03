<?php 
use yii\widgets\DetailView;
use yii\helpers\Html;
use yii\helpers\ArrayHelper;
use common\models\Conference;
use yii\widgets\ActiveForm; 
use yii\widgets\Pjax;

use yii\widgets\modal;

?>
<div class="content container ">

	<div class="row">
		<div class="col-md-6">
		<div class="main-register">
	<?php echo \frontend\widgets\Alert::widget() ?>
	<div class="register-pages floated bg-white" style="padding:25px;margin:15px;border-radius:15px;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
	
	<h2 style="text-align:center;">Мақала жіберу</h2>
	<?php $form = ActiveForm::begin(['options' => ['enctype' => 'multipart/form-data']]); ?>
	<ol>
		<li><label class="labels">Аты-жөніңіз: </label><?php echo $form->field($model,'fio')->textInput(['class'=>'header__enter__input','placeholder'=>''])->label(false) ?></li>
		<li><label class="labels">Мақала атауы: </label><?php echo $form->field($model,'article')->textInput(['class'=>'header__enter__input','placeholder'=>''])->label(false) ?></li>
		<li><label class="labels">Жұмыс орын атауы </label><?php echo $form->field($model,'position')->textInput(['class'=>'header__enter__input','placeholder'=>''])->label(false) ?></li>
		<li><label class="labels">Ғылыми дәреже, атағы : </label><?php echo $form->field($model,'category')->textInput(['class'=>'header__enter__input','placeholder'=>''])->label(false) ?></li>
		<li><label class="labels">Бет саны: </label><?php echo $form->field($model,'country')->textInput(['class'=>'header__enter__input','placeholder'=>''])->label(false) ?></li>
		<li><label class="labels">Байланыс номеріңіз немесе пошта: </label><?php echo $form->field($model,'tel')->textInput(['class'=>'header__enter__input','placeholder'=>''])->label(false) ?></li>
		<li>
			<div class="conts">
                <div class="row">
					<div class="col-6 col-md-3">
						<main class="main_full">
							<div class="containers_">
								<div class="panel">
									<div class="button_outer">
										<div class="btn_upload">
											<input type="file" class="my" id="upload_file" name="Reg[file]" multiple="multiple"/>Мақаланы тіркеу
										</div>
										<div class="processing_bar"></div>
										<div class="success_box"></div>
									</div>
								</div>
								<div class="error_msg"></div>
								<!-- <div class="uploaded_file_view" id="uploaded_view">
									<span class="file_remove">X</span>
								</div> -->
								<?php if (Yii::$app->session->hasFlash('error')): ?>
									<div class="alert alert-danger">
										<?= Yii::$app->session->getFlash('error') ?>
									</div>
								<?php endif; ?>

								<?php if (Yii::$app->session->hasFlash('success')): ?>
									<div class="alert alert-success">
										<?= Yii::$app->session->getFlash('success') ?>
									</div>
								<?php endif; ?>

							</div>
						</main>
					</div>
					<div class="col-12 col-md-4">
						<div class="col-lg-offset-2 col-lg-11 sbmt"><?php echo Html::submitButton('Жіберу', ['class' => 'btn btn-primary']) ?></div>
					</div>
				</div>
			</div>
			<div class="dada col-4"></div>
		</li>         
	</ol>
	<div class="form-group"></div>
	<?php ActiveForm::end() ?>
</div>
</div>

		</div>
		<div class="col-md-6">
			<div class="bg-white" style="padding:25px;margin:15px;border-radius:15px;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
			<h2 style="text-align:center;font-size: 19px;">«Тіл және қоғам» электронды ғылыми журналына (альманағына) жарияланатын мақаланы рәсімдеуге қойылатын талаптар</h2>
			<iframe src="/file/til-jane-qogam.pdf"></iframe>
			<a href="/file/til-jane-qogam.pdf" download class="ereje-btn">Жүктеу</a>

		</div>
			
		</div>
	</div>
	





<style>
	.col-md-6 iframe {
		border: 0;
    width: 100%;
    height: 600px;
    }.ereje-btn {
		font-size: 16px;
    font-weight: 500;
    padding: 10px;
    background: #56b18f;
    color: #fff;
    border-radius: 8px;
    /* margin-top: 10px; */
    display: flex;
    justify-items: center;
    justify-content: center;
    width: 150px;
	}
.conts {    width: 700px;}
.btn-primary {   height: 50px;    width: 200px;    font-weight: 600; }
* {margin: 0; padding: 0; box-sizing: border-box;}
.panel {background: none; border: none; box-shadow: none;text-align: center;}
.button_outer {background: #007398; border-radius:4px; text-align: center; height: 50px; width: 200px; display: inline-block; transition: .2s; position: relative; overflow: hidden;}
.btn_upload {padding: 17px 30px 12px; color: #fff; text-align: center; position: relative; display: inline-block; overflow: hidden; z-index: 3; white-space: nowrap;}
.btn_upload input {position: absolute; width: 100%; left: 0; top: 0; width: 100%; height: 105%; cursor: pointer; opacity: 0;}
.file_uploading {width: 100%; height: 10px; margin-top: 20px; background: #ccc;}
.file_uploading .btn_upload {display: none;}
.processing_bar {position: absolute; left: 0; top: 0; width: 0; height: 100%; background:#007398eb; transition: 3s;}
.file_uploading .processing_bar {width: 100%;}
.success_box {display: none; width: 50px; height: 50px; position: relative;}
.success_box:before {content: ''; display: block; width: 14px;    height: 22px; border-bottom: 6px solid #fff; border-right: 6px solid #fff; -webkit-transform:rotate(45deg); -moz-transform:rotate(45deg); -ms-transform:rotate(45deg); transform:rotate(45deg); position: absolute; left: 17px; top: 10px;}
.file_uploaded .success_box {display: inline-block;}
.file_uploaded {margin-top: 0; width: 50px; background:#83ccd3; height: 50px;}
.uploaded_file_view {max-width: 100px; margin: 40px auto; text-align: center; position: relative; transition: .2s; opacity: 0; border: 2px solid #ddd; padding: 15px;}
.file_remove{width: 30px; height: 30px; border-radius: 50%; display: block; position: absolute; background: #aaa; line-height: 30px; color: #fff; font-size: 12px; cursor: pointer; right: -15px; top: -15px;}
.file_remove:hover {background: #222; transition: .2s;}
.uploaded_file_view img {max-width: 100%;}
.uploaded_file_view.show {opacity: 1;}
.error_msg {text-align: center; color: #f00}
.alert {
    padding: 10px;
    background-color: #f44336; /* Red */
    color: white;
    margin-bottom: 15px;
}

.alert-success {
    background-color: #4CAF50; /* Green */
}

.alert-danger {
    background-color: #f44336; /* Red */
}

.alert-info {
    background-color: #2196F3; /* Blue */
}

.alert-warning {
    background-color: #ff9800; /* Orange */
}

.alert-dismissible {
    padding-right: 35px;
}

.alert-dismissible .close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.75rem 1.25rem;
    color: inherit;
}
</style>

    <script>
    var btnUpload = $("#upload_file"),
		btnOuter = $(".button_outer");
	btnUpload.on("change", function(e){
        console.log("File selected");  // Добавьте эту строку для проверки
		var ext = btnUpload.val().split('.').pop().toLowerCase();
		if($.inArray(ext, ['doc','docx','pdf']) == -1) {
			$(".error_msg").text("Мақаланы .doc форматында жүктеңіз.");
		} else {
			$(".error_msg").text("");
			btnOuter.addClass("file_uploading");
			setTimeout(function(){
				btnOuter.addClass("file_uploaded");
			},3000);
			var uploadedFile = URL.createObjectURL(e.target.files[0]);
			setTimeout(function(){
				$("#uploaded_view").append('<a href="'+uploadedFile+'"><img src="https://www.pngall.com/wp-content/uploads/2/Download-Button-PNG-Image-File.png" /></a>').addClass("show");
			},3500);
		}
	});
	$(".file_remove").on("click", function(e){
		$("#uploaded_view").removeClass("show");
		$("#uploaded_view").find("img").remove();
		btnOuter.removeClass("file_uploading");
		btnOuter.removeClass("file_uploaded");
	});
    </script>
	<script>
$(document).ready(function() {
    $('#upload_file').change(function() {
        if ($(this).val()) {
            alert('Файл выбран: ' + $(this).val());
        } else {
            alert('Файл не выбран.');
        }
    });
});
</script>
