<div class="container">
    <ol class="page">
        <li class="b-breadcrumb__item"><a href="/faq">F.A.Q.</a></li>
        <li class="b-breadcrumb__item b-breadcrumb__item--active">Сұрақ қою</li>
    </ol>

    <h2>Сұрағыңызға рақмет!</h2>

    <div>Redirect to <span class="timer__item" id="time">00:10</span> second to EMLE.KZ site!</div>

    <script>
         setTimeout(function(){
            window.location.href = 'https://emle.kz/';
         }, 11000);
    </script>
    <script>
        function startTimer(duration, display) {
            var timer = duration, minutes, seconds;
            setInterval(function () {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                display.textContent = minutes + ":" + seconds;

                if (--timer < 0) {
                    timer = duration;
                }
            }, 1000);
        }
        
        window.onload = function () {
            var fiveMinutes = 10,
                display = document.querySelector('#time');
            startTimer(fiveMinutes, display);
        };
    </script>
</div>



<style>
.timer__item {
  position: relative;
  min-width: 60px;
  margin-left: 10px;
  margin-right: 10px;
  padding-bottom: 15px;
  text-align: center;
}
</style>