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
    const safeMs = Math.max(0, ms);
    const totalSeconds = Math.ceil(safeMs / 1000);
    const displaySeconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);

    return `${minutes.toString().padStart(2, "0")}:${displaySeconds.toString().padStart(2, "0")}`;
}

function getTimeLeft() {
    const elapsed = Date.now() - startTime;
    return remainingTime - elapsed;
}

function stopInterval() {
    clearInterval(timerId);
    timerId = null;
}

function updateTimerDisplay(ms) {
    timerDisplay.textContent = formatTime(ms);
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

    updateTimerDisplay(remainingTime);

    timerId = setInterval(() => {
        const timeLeft = getTimeLeft();

        if(timeLeft <= 0) {
            stopInterval();
            timerDisplay.textContent = "00:00";

            alarmSound.currentTime = 0;
            alarmSound.play();
            alert("タイムアップ！");

            return;
        }

        updateTimerDisplay(timeLeft);
    }, 1000);
}

function switchPomodoroMode() {
    if(mode === "work") {
        mode = "break";
        remainingTime = breakMinutes * 60 * 1000;

        sessionCount++;
    } else {
        mode = "work";
        remainingTime = workMinutes * 60 * 1000;
    }
}

function updatePomodoroDisplay(ms) {
    pomodoroDisplay.textContent = formatTime(ms);
}

function updatePomodoroInfo() {
    modeDisplay.textContent = mode === "work" ? "作業" : "休憩";
    sessionDisplay.textContent = `セッション: ${sessionCount}`;
}

function startPomodoro() {
    if(timerId) return;

    if(remainingTime === 0) {
        remainingTime = workMinutes * 60 * 1000;
    }

    updatePomodoroInfo();
    updatePomodoroDisplay(remainingTime);

    startTime = Date.now();

    timerId = setInterval(() => {
        const timeLeft = getTimeLeft();

        if(timeLeft <= 0) {
            switchPomodoroMode();

            updatePomodoroInfo();
            updatePomodoroDisplay(remainingTime);

            startTime = Date.now();

            alarmSound.currentTime = 0;
            alarmSound.play();
            alert("タイムアップ！");

            return;
        }

        updatePomodoroDisplay(timeLeft);
    }, 1000);
}

function resetTimer() {
    minutesInput.disabled = false;
    secondsInput.disabled = false;

    stopInterval();

    remainingTime = 0;
    updateTimerDisplay(0);

    minutesInput.value = "";
    secondsInput.value = "";
}

function resetPomodoro() {
    stopInterval();

    mode = "work";
    remainingTime = workMinutes * 60 * 1000;

    updatePomodoroInfo();
    updatePomodoroDisplay(remainingTime);
}

startBtn.onclick = () => {
    if(currentTab === "timer") {
        startTimer();
    } else {
        startPomodoro();
    }
};

stopBtn.onclick = () => {
    stopInterval();

    const elapsed = Date.now() - startTime;
    remainingTime = Math.max(0, remainingTime - elapsed);
};

resetBtn.onclick = () => {
    if(currentTab === "timer") {
        resetTimer();
    } else {
        resetPomodoro();
    }
};

showTimerUI();