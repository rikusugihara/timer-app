// タブ関係
const timerTab = document.getElementById("timerTab");
const pomodoroTab = document.getElementById("pomodoroTab");

// タイマー関係
const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");
const timerDisplay = document.getElementById("timerDisplay");

// ポモドーロ関係
const modeDisplay = document.getElementById("modeDisplay");
const sessionDisplay = document.getElementById("sessionCount");
const pomodoroDisplay = document.getElementById("pomodoroDisplay");

// ボタン関係
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

// アラーム音の取得
const alarmSound = new Audio("./music/alarm.mp3");


// 今どちらの画面か
let currentTab = "timer";

// 再開時も含めた残り時間
let remainingTime = 0;

// 開始した瞬間の時刻
let startTime = 0;

// 今intervalが動いているか
let timerId = null;

// workかbreakか
let mode = "work";

// 作業完了回数
let sessionCount = 0;

// ポモドーロの作業時の初期時間
const workMinutes = 25;

// ポモドーロの休憩時の初期時間
const breakMinutes = 5;


// bodyの見た目切替
function setBodyMode(className) {
    document.body.classList.remove("timer-mode", "work-mode", "break-mode");
    document.body.classList.add(className);
}


// タブのactive切替
function updateActiveTab() {
    if(currentTab === "timer") {
        timerTab.classList.add("active");
        pomodoroTab.classList.remove("active");
    } else {
        timerTab.classList.remove("active");
        pomodoroTab.classList.add("active");
    }
}


// タイマータブの時の表示
function showTimerUI() {
    minutesInput.style.display = "inline";
    secondsInput.style.display = "inline";
    timerDisplay.style.display = "block";
    modeDisplay.style.display = "none";
    sessionDisplay.style.display = "none";
    pomodoroDisplay.style.display = "none";

    updateActiveTab();
    setBodyMode("timer-mode");
}

// ポモドーロタブの時の表示
function showPomodoroUI() {
    minutesInput.style.display = "none";
    secondsInput.style.display = "none";
    timerDisplay.style.display = "none";
    modeDisplay.style.display = "block";
    sessionDisplay.style.display = "block";
    pomodoroDisplay.style.display = "block";

    updateActiveTab()
    setBodyMode(mode === "work" ? "work-mode" : "break-mode");
}


// タブ切替え
// タイマータブ選択時
timerTab.onclick = () => {
    currentTab = "timer";
    showTimerUI();
};

// ポモドーロタブ選択時
pomodoroTab.onclick = () => {
    currentTab = "pomodoro";
    showPomodoroUI();
};


// タイマー表示のフォーマットを作成
function formatTime(ms) {
    const safeMs = Math.max(0, ms);
    const totalSeconds = Math.ceil(safeMs / 1000);
    const displaySeconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);

    return `${minutes.toString().padStart(2, "0")}:${displaySeconds.toString().padStart(2, "0")}`;
}


// 共通関数の作成
// 残り時間の算出
function getTimeLeft() {
    const elapsed = Date.now() - startTime;
    return remainingTime - elapsed;
}

// ストップ時のtimerIdの変更
function stopInterval() {
    clearInterval(timerId);
    timerId = null;
}


// タイマー用の関数
// timerDisplayの表示更新
function updateTimerDisplay(ms) {
    timerDisplay.textContent = formatTime(ms);
}


// タイマー機能
function startTimer() {
    // 動いていたらreturn
    if(timerId) return;

    // 残り時間が０なら入力値から初期時間の取得
    if(remainingTime === 0) {
        // スタートしたら入力値の変更を不可にする
        minutesInput.disabled = true;
        secondsInput.disabled = true;

        // 入力欄の値を取得
        const minutes = Number(minutesInput.value) || 0;
        const seconds = Number(secondsInput.value) || 0;

        // 入力値が０ならreturn
        if(minutes === 0 && seconds === 0) return;

        // 入力された値をmsに変換してremainingTimeに設定
        remainingTime = (minutes * 60 + seconds) * 1000;
    }

    // 開始した瞬間の時間を取得
    startTime = Date.now();

    // 初回表示
    updateTimerDisplay(remainingTime);

    //intervalの開始
    timerId = setInterval(() => {
        // 残り時間の計算
        const timeLeft = getTimeLeft();

        // ０以下なら終了
        if(timeLeft <= 0) {
            // timerIdの更新
            stopInterval();

            // タイマーの表示を0に
            updateTimerDisplay(0);

            // 終了時の音楽とアラート
            alarmSound.currentTime = 0;
            alarmSound.play();
            alert("時間終了！");

            return;
        }

        // そうでないなら表示を更新
        updateTimerDisplay(timeLeft);
    }, 1000);
}


// ポモドーロ用の関数
// ポモドーロの作業と休憩の切替
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

// pomodoroDisplayの表示更新
function updatePomodoroDisplay(ms) {
    pomodoroDisplay.textContent = formatTime(ms);
}

// ポモドーロの状態管理
function updatePomodoroInfo() {
    modeDisplay.textContent = mode === "work" ? "作業" : "休憩";
    sessionDisplay.textContent = `セッション: ${sessionCount}`;

    if(currentTab === "pomodoro") {
        setBodyMode(mode === "work" ? "work-mode" : "break-mode");
    }
}


// ポモドーロ機能
function startPomodoro() {
    // 動いていたらreturn
    if(timerId) return;

    // 残り時間が０ならworkの時間を入れる
    if(remainingTime === 0) {
        remainingTime = workMinutes * 60 * 1000;
    }

    // 初回表示を出す
    updatePomodoroInfo()
    updatePomodoroDisplay(remainingTime);

    // 開始した瞬間の時間を取得
    startTime = Date.now();

    // intervalの開始
    timerId = setInterval(() => {
        // 残り時間の算出
        const timeLeft = getTimeLeft();

        // 0以下ならmodeの切替
        if(timeLeft <= 0) {
            // modeの切替
            switchPomodoroMode();

            // mode表示と時間表示を更新
            updatePomodoroInfo();
            updatePomodoroDisplay(remainingTime);

            // startTimeを更新して次周回へ
            startTime = Date.now();

            // 終了時の音楽とアラート
            alarmSound.currentTime = 0;
            alarmSound.play();
            alert("時間終了！");

            return;
        }

        // そうでないなら表示を更新
        updatePomodoroDisplay(timeLeft);
    }, 1000);
}


// タイマー用のリセット機能
function resetTimer() {
    // 入力欄を使えるように戻す
    minutesInput.disabled = false;
    secondsInput.disabled = false;

    // timerIdの状態変更
    stopInterval();

    // 残り時間を0に
    remainingTime = 0;

    // 表示を00:00に
    updateTimerDisplay(0);

    // 入力欄を空にする
    minutesInput.value = "";
    secondsInput.value = "";
}


// ポモドーロ用のリセット機能
function resetPomodoro() {
    // timerIdの状態変更
    stopInterval();

    // modeをworkに
    mode = "work";

    // remainingTimeはworkの時間に
    remainingTime = workMinutes * 60 * 1000;

    // modeと時間表示の更新
    updatePomodoroInfo();
    updatePomodoroDisplay(remainingTime);
}


// ボタンを繋ぐ
// スタートボタン
startBtn.onclick = () => {
    if(currentTab === "timer") {
        startTimer();
    } else {
        startPomodoro();
    }
};

// ストップボタン
stopBtn.onclick = () => {
    // timerIdの状態変更
    stopInterval();

    // スタートからの経過時間を計算
    const elapsed = Date.now() - startTime;

    // 今の残り時間を保存
    remainingTime = Math.max(0, remainingTime - elapsed);
};

// リセットボタン
resetBtn.onclick = () => {
    if(currentTab === "timer") {
        resetTimer();
    } else {
        resetPomodoro();
    }
};


// 初期画面をタイマーに設定
showTimerUI();