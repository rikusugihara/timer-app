// タブ切替に関するDOM取得
const timerTab = document.getElementById("timerTab");
const pomodoroTab = document.getElementById("pomodoroTab");

// タイマーに関するDOM取得
const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");
const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

// ポモドーロに関するDOM取得
const modeDisplay = document.getElementById("modeDisplay");
const sessionDisplay = document.getElementById("sessionCount");
const pomodoroDisplay = document.getElementById("pomodoroDisplay");

// 終了時のアラーム音の取得
const alarmSound = new Audio("../music/alarm.mp3");

// タブ切替に関する変数
let currentTab = "timer";

// タイマーに関する変数
let remainingTime = 0;
let startTime = 0;
let timerId = null;

// ポモドーロに関する変数
let mode = "work";
const workMinutes = 25;
const breakMinutes = 5;
let sessionCount = 0;

function showTimerUI() {
    minutesInput.style.display = "inline";
    secondsInput.style.display = "inline";
    modeDisplay.style.display = "none";
    sessionDisplay.style.display = "none";
    timerDisplay.style.display = "block";
    pomodoroDisplay.style.display = "none";
}

function showPomodoroUI() {
    minutesInput.style.display = "none";
    secondsInput.style.display = "none";
    modeDisplay.style.display = "block";
    sessionDisplay.style.display = "block";
    timerDisplay.style.display = "none";
    pomodoroDisplay.style.display = "block";
}

timerTab.onclick = () => {
    currentTab = "timer";
    showTimerUI();
};

pomodoroTab.onclick = () => {
    currentTab = "pomodoro";
    showPomodoroUI();
};

function formatTime(ms) {
    const milliSeconds = ms % 1000;
    const seconds = Math.floor(ms / 1000);
    const displaySeconds = seconds % 60;
    const minutes = Math.floor(seconds / 60);

    return `${minutes.toString().padStart(2, "0")}:${displaySeconds.toString().padStart(2, "0")}:${Math.floor(milliSeconds / 10).toString().padStart(2, "0")}`;
}

function startTimer() {
    if(timerId) return;

    if(remainingTime === 0) {
        minutesInput.disabled = true;
        secondsInput.disabled = true;

        const minutes = Number(minutesInput.value) || 0;
        const seconds = Number(secondsInput.value) || 0;

        if(minutes === 0 && seconds === 0) return;

        remainingTime = (minutes * 60 + seconds) * 1000;
    }

    startTime = Date.now();

    timerId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const timeLeft = remainingTime - elapsed;

        if(timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            timerDisplay.textContent = "00:00:00";

            alarmSound.currentTime = 0;
            alarmSound.play();
            alert("タイムアップ！");

            return;
        }

        timerDisplay.textContent = formatTime(timeLeft);
    }, 1000);
}

function startPomodoro() {
    modeDisplay.textContent = "作業";
    pomodoroDisplay.textContent = "25:00:00";

    if(timerId) return;

    if(remainingTime === 0) {
        remainingTime = workMinutes * 60 * 1000;
    }

    startTime = Date.now();

    timerId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const timeLeft = remainingTime - elapsed;

        if(timeLeft <= 0) {
            if(mode === "work") {
                mode = "break";
                remainingTime = breakMinutes * 60 * 1000;

                sessionCount++;
                sessionDisplay.textContent = `セッション: ${sessionCount}`;
            } else {
                mode = "work";
                remainingTime = workMinutes * 60 * 1000;
            }

            modeDisplay.textContent = mode === "work" ? "作業" : "休憩";

            alarmSound.currentTime = 0;
            alarmSound.play();
            alert("タイムアップ！");

            startTime = Date.now();

            return;
        }

        pomodoroDisplay.textContent = formatTime(timeLeft);
    }, 1000);
}

function resetTimer() {
    minutesInput.disabled = false;
    secondsInput.disabled = false;

    clearInterval(timerId);
    timerId = null;

    remainingTime = 0;
    timerDisplay.textContent = "00:00:00";

    minutesInput.value = "";
    secondsInput.value = "";
}

function resetPomodoro() {
    clearInterval(timerId);
    timerId = null;

    remainingTime = 0;
    pomodoroDisplay.textContent = "25:00:00";

    sessionCount = 0;
    sessionDisplay.textContent = "セッション: 0";
}

startBtn.onclick = () => {
    if(currentTab === "timer") {
        startTimer();
    } else {
        startPomodoro();
    }
};

stopBtn.onclick = () => {
    if(!timerId) return;

    clearInterval(timerId);
    timerId = null;

    const elapsed = Date.now() - startTime;
    remainingTime -= elapsed;
};

resetBtn.onclick = () => {
    if(currentTab === "timer") {
        resetTimer();
    } else {
        resetPomodoro();
    }
};

showTimerUI();