var settings = {
  work: .125 * 60 * 1000, //In Minutes
  short_break: .25 * 60 * 1000, //In MInutes
  long_break: .5 * 60 * 1000, //in Minutes
  tick_time: 300,
  short_long_ratio: 2
};
//Global Variables
var mode = "work",
  work_count = 0,
  timer_interval,
  timer_curr = settings.work,
  timer_time;

function time_string(time) {
  time /= 1000; //For Milliseconds
  let time_m = Math.trunc(time / 60);
  let time_s = Math.trunc(time % 60);
  //Pad for display purposes
  if (time_m < 10)
    time_m = String(time_m).padStart(2, "0");
  if (time_s < 10)
    time_s = String(time_s).padStart(2, "0");
  return time_m + ":" + time_s
}

function set_timer(time) {
  let time_elem = document.getElementById("time");
  if (time) {
    timer_curr = time;
  }
  time_elem.innerHTML = time_string(timer_curr);
}

function tick_timer() {
  if (!timer_time) {
    timer_time = Date.now();
  }
  if (timer_curr <= 0) {
    on_timer_end()
    return;
  }
  console.log(timer_curr);
  timer_curr -= Date.now() - timer_time;
  timer_time = Date.now();

  set_timer(timer_curr);
}

function pause_timer() {
  if (timer_interval) {
    clearInterval(timer_interval);
    timer_interval = null;
  }
  timer_time = null;
}

function reset_timer() {
  pause_timer();
  set_timer(settings[mode]);
}

function start_timer() {
  if (!timer_interval) {
    timer_interval = setInterval(tick_timer, settings.tick_time);
  }
}

function next_timer() {
  if (mode == "work") {
    if (work_count > settings.short_long_ratio) {
      button_id = "btn_long_break";
      work_count = 0;
    } else {
      button_id = "btn_short_break";
    }
  } else {
    button_id = "btn_work_time";
  }
  document.getElementById(button_id).click();
}

function on_timer_end() {
  clearInterval(timer_interval);
}

(function assign_listeners() {
  //Switch Mode & Pause Timer & Set Timer
  var mode_btns = document.getElementsByClassName("btn_mode");
  for (var i = 0; i < mode_btns.length; i++) {
    mode_btns[i].addEventListener("click", function () {
      var active_elem = document.getElementsByClassName("active");
      active_elem[0].className = active_elem[0].className.replace(" active", "");
      this.className += " active";
      mode = this.value;
      pause_timer();
      set_timer(settings[mode]);
      let btn_next_elem = document.getElementById("btn_next")
      if (mode == "work") {
        work_count += 1;
        btn_next_elem.innerHTML = "Take A Breath";
      } else {
        btn_next_elem.innerHTML = "Back To The Grind";
      }
    });
  }

  document.getElementById("btn_start")
    .addEventListener("click", start_timer);

  document.getElementById("btn_pause")
    .addEventListener("click", pause_timer);

  document.getElementById("btn_reset")
    .addEventListener("click", reset_timer);

  document.getElementById("btn_next")
    .addEventListener("click", next_timer);

  document.getElementById("btn_play")
    .addEventListener("click", function () {
      if (this.className.includes("btn_pause")) {
        this.className = this.className.replace(" btn_pause", "");
        pause_timer();
      } else {
        this.className += " btn_pause";
        start_timer();
      }
      console.log(this.className);
    });


}());


document.getElementById("btn_work_time").click();