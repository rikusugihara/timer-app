const timeDisplay = document.getElementById("time");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

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

startBtn.onclick = () => {
    if(timerId) return;

    if(remainingTime === 0) {
        minutesInput.disabled = true;
        secondsInput.disabled = true;

        const minutes = Number(document.getElementById("minutesInput").value) || 0;
        const seconds = Number(document.getElementById("secondsInput").value) || 0;

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
            alert("時間終了！");
            return;
        }

        timeDisplay.textContent = formatTime(timeLeft);
    }, 10);
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
}