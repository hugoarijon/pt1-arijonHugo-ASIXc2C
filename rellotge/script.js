document.addEventListener("DOMContentLoaded", () => {
    // Agafem els elements del HTML
    const timeDisplay = document.getElementById("time");
    const countdownDisplay = document.getElementById("countdown");
    const startBtn = document.getElementById("startTimer");
    const resetBtn = document.getElementById("resetTimer");
    const endTimeInput = document.getElementById("endTime");
    const durationInput = document.getElementById("duration");
    const toggleThemeBtn = document.getElementById("toggleTheme");
    const alarmSound = new Audio("assets/alarm.mp3");
    let timer;

    // Funció per mostrar l'hora actual
    function updateClock() {
        timeDisplay.textContent = new Date().toLocaleTimeString("ca-ES");
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Funció per iniciar el temporitzador
    function startTimer() {
        clearInterval(timer); // Reinicia el temporitzador
        let seconds = 0;

        if (endTimeInput.value) {
            // Calcula el temps restant fins a una hora exacta
            const now = new Date();
            const [h, m] = endTimeInput.value.split(":").map(Number);
            const endTime = new Date();
            endTime.setHours(h, m, 0);
            seconds = Math.max(0, Math.floor((endTime - now) / 1000));
        } else if (durationInput.value) {
            // Agafa el temps indicat en format HH:MM:SS
            const [h = 0, m = 0, s = 0] = durationInput.value.split(":").map(Number);
            seconds = h * 3600 + m * 60 + s;
        }

        // Comença el compte enrere
        timer = setInterval(() => {
            if (seconds <= 0) {
                clearInterval(timer);
                countdownDisplay.textContent = "00:00:00";
                alarmSound.play(); // 🔊 Reprodueix el so quan arriba a 0
            } else {
                seconds--;
                countdownDisplay.textContent = new Date(seconds * 1000).toISOString().substr(11, 8);
            }
        }, 1000);
    }

    // Funció per reiniciar el temporitzador
    function resetTimer() {
        clearInterval(timer);
        countdownDisplay.textContent = "00:00:00";
    }

    // Canviar entre mode fosc i clar
    function toggleTheme() {
        document.body.classList.toggle("dark-mode");
        document.body.classList.toggle("light-mode");
    }

    // Afegim els events als botons
    startBtn.addEventListener("click", startTimer);
    resetBtn.addEventListener("click", resetTimer);
    toggleThemeBtn.addEventListener("click", toggleTheme);
});