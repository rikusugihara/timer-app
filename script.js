const timerTab = document.getElementById("timerTab");
const pomodoroTab = document.getElementById("pomodoroTab");

const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");

const modeDisplay = document.getElementById("modeDisplay");
const sessionDisplay = document.getElementById("sessionCount");

const timeDisplay = document.getElementById("time");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

const alarmSound = new Audio("./music/alarm.mp3");

let currentTab = "timer";
let mode = "work";
const workMinutes = 25;
const breakMinutes = 5;
let sessionCount = 0;
let remainingTime = 0;
let startTime = 0;
let timerId = null;

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    const milliSeconds = ms % 1000;

    return `${minutes.toString().padStart(2, "0")}:${displaySeconds.toString().padStart(2, "0")}:${Math.floor(milliSeconds / 10).toString().padStart(2, "0")}`;
}

function resetAll() {
    clearInterval(timerId);
    timerId = null;
    remainingTime = 0;
    timeDisplay.textContent = "00:00:00";

    minutesInput.disabled = false;
    secondsInput.disabled = false;
}

function showTimerUI() {
    minutesInput.style.display = "inline";
    secondsInput.style.display = "inline";
    modeDisplay.style.display = "none";
    sessionDisplay.style.display = "none";
}

function showPomodoroUI() {
    minutesInput.style.display = "none";
    secondsInput.style.display = "none";
    modeDisplay.style.display = "block";
    sessionDisplay.style.display = "block";
}

timerTab.onclick = () => {
    resetAll();
    currentTab = "timer";
    showTimerUI();
};

pomodoroTab.onclick = () => {
    resetAll();
    currentTab = "pomodoro";
    showPomodoroUI();
};

function startTimerMode() {
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
            timeDisplay.textContent = "00:00:00";

            alarmSound.currentTime = 0;
            alarmSound.play();
            alert("時間終了！");

            return;
        }

        timeDisplay.textContent = formatTime(timeLeft);
    }, 10);
}

function startPomodoroMode() {
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
                sessionDisplay.textContent = `${sessionCount}回`;
            } else {
                mode = "work";
                remainingTime = workMinutes * 60 * 1000;
            }

            startTime = Date.now();

            document.title = `${mode === "work" ? "作業" : "休憩"} ${formatTime(remainingTime)}`;
            modeDisplay.textContent = mode === "work" ? "作業" : "休憩";

            alarmSound.currentTime = 0;
            alarmSound.play();

            return;
        }

        timeDisplay.textContent = formatTime(timeLeft);
    }, 10);
}

startBtn.onclick = () => {
    if(currentTab === "timer") {
        startTimerMode();
    } else {
        startPomodoroMode();
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
    minutesInput.disabled = false;
    secondsInput.disabled = false;

    clearInterval(timerId);
    timerId = null;

    remainingTime = 0;
    timeDisplay.textContent = "00:00:00";

    minutesInput.value = "";
    secondsInput.value = "";

    sessionCount = 0;
    sessionDisplay.textContent = "0回";
}

showTimerUI();