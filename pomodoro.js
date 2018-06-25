var settings = {
  work: 25 * 60000, //In Minutes
  short_break: 5 * 60000, //In MInutes
  long_break: 10 * 60000, //in Minutes
  tick_time: 200,
  short_long_ratio: 4,
  sound: Boolean(true),
  sound_effect: "end_videogame.wav"
};
//Global Variables
var mode = "work",
  work_count = 0,
  timer_interval,
  timer_curr = settings.work,
  timer_time;


(function settings_menu() {
  document.getElementById("btn_open_settings")
    .addEventListener("click", function () {
      document.getElementById('menu').style.display = 'block';
    });

  document.getElementById("btn_close_settings")
    .addEventListener("click", function () {
      document.getElementById('menu').style.display = 'none';
    });

  document.getElementById("dd_timer_work").onchange = function () {
    let curr_val = this.options[this.selectedIndex].value;
    settings.work = curr_val;
    document.getElementById("btn_work_time").click();
  }
  document.getElementById("dd_timer_short").onchange = function () {
    let curr_val = this.options[this.selectedIndex].value;
    settings.short_break = curr_val;
    document.getElementById("btn_work_time").click();
  }
  document.getElementById("dd_timer_long").onchange = function () {
    let curr_val = this.options[this.selectedIndex].value;
    settings.long_break = curr_val;
    document.getElementById("btn_work_time").click();
  }
  document.getElementById("cb_sound")
    .addEventListener("click", function () {
      settings.sound = !settings.sound;
    });

  document.getElementById("btn_test_sound")
    .addEventListener("click", play_sound);

  document.getElementById("dd_sound_effect").onchange = function () {
    let curr_val = this.options[this.selectedIndex].value;
    settings.sound_effect = curr_val;
    document.getElementById("btn_work_time").click();
  }
}());

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
  document.title = time_string(timer_curr);

}



function tick_timer() {

  if (!timer_time) {

    timer_time = Date.now();
  }
  if (timer_curr <= 0) {
    on_timer_end()
    return;
  }
  timer_curr -= Date.now() - timer_time;
  timer_time = Date.now();

  set_timer(timer_curr);
}

function pause_timer() {
  play_btn_state("play");
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
    play_btn_state("pause");
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

function play_btn_state(state) {
  let elem = document.getElementById("btn_play");
  if (state == "play") {
    elem.className = elem.className.replace(" btn_pause", "");
  } else {
    this.className += " btn_pause";
  }
}

function play_sound() {
  var audio = new Audio(settings.sound_effect);
  audio.play();
}

function on_timer_end() {
  clearInterval(timer_interval);
  play_btn_state("play")
  if (settings.sound == true) {
    play_sound();
  }
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
        btn_next_elem.innerHTML = "TIme To Focus";
      }
    });
  }
  document.getElementById("btn_reset")
    .addEventListener("click", reset_timer);

  document.getElementById("btn_next")
    .addEventListener("click", next_timer);

  document.getElementById("btn_play")
    .addEventListener("click", function () {
      if (this.className.includes("btn_pause")) {
        //this.className = this.className.replace(" btn_pause", "");
        pause_timer();
      } else {
        this.className += " btn_pause";
        start_timer();
      }
    });
}());

document.getElementById("btn_work_time").click();