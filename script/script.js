// ========= BASIC CONFIG =========
const recipientName = "Buddy";
const senderName = "Your Friend";
// Set birthday target in local time: YYYY-MM-DDTHH:mm:ss
const birthdayTargetISO = "2026-02-2711:46:00";

// ========= DOM ELEMENTS =========
const screens = document.querySelectorAll(".screen");
const startBtn = document.getElementById("start-btn");
const envelope = document.getElementById("envelope");
const toCelebrationBtn = document.getElementById("to-celebration-btn");
const toFinalBtn = document.getElementById("to-final-btn");
const replayBtn = document.getElementById("replay-btn");
const music = document.getElementById("bg-music");
const musicToggleBtn = document.getElementById("music-toggle-btn");

const recipientNameTitle = document.getElementById("recipient-name-title");
const recipientNameMain = document.getElementById("recipient-name-main");
const senderNameSpan = document.getElementById("sender-name");

const typewriterEl = document.getElementById("typewriter");
const confettiContainer = document.querySelector(".confetti-container");
const balloonContainer = document.querySelector(".balloon-container");
const countdownOverlay = document.getElementById("countdown-overlay");
const countdownPanel = document.getElementById("countdown-panel");
const countdownDays = document.getElementById("countdown-days");
const countdownHours = document.getElementById("countdown-hours");
const countdownMinutes = document.getElementById("countdown-minutes");
const countdownSeconds = document.getElementById("countdown-seconds");

const giftBox = document.getElementById("gift-box");
const giftMessage = document.getElementById("gift-message");
const secretTapBtn = document.getElementById("secret-tap-btn");
const secretReveal = document.getElementById("secret-reveal");

// ========= INITIAL TEXT FILL =========
if (recipientNameTitle) recipientNameTitle.textContent = recipientName;
if (recipientNameMain) recipientNameMain.textContent = recipientName;
if (senderNameSpan) senderNameSpan.textContent = senderName;

// ========= SCREEN NAVIGATION =========
let currentScreen = 0;

function showScreen(index) {
    screens[currentScreen].classList.remove("active");
    currentScreen = index;
    screens[currentScreen].classList.add("active");
    triggerScreenEntrance(screens[currentScreen]);
}

function triggerScreenEntrance(screenEl) {
    if (!screenEl) return;
    screenEl.classList.remove("screen-animate");
    void screenEl.offsetWidth;
    screenEl.classList.add("screen-animate");
}

// ========= AUDIO =========
function playMusic() {
    if (!music) return;
    music.play().catch(() => {});
}

function updateMusicToggleLabel() {
    if (!musicToggleBtn || !music) return;
    const isMuted = music.muted;
    musicToggleBtn.textContent = isMuted ? "Unmute Music" : "Mute Music";
    musicToggleBtn.setAttribute("aria-pressed", String(isMuted));
}

let audioUnlocked = false;
let countdownFinished = false;
function unlockAudioOnFirstInteraction() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    if (countdownFinished) playMusic();
    document.removeEventListener("pointerdown", unlockAudioOnFirstInteraction);
    document.removeEventListener("keydown", unlockAudioOnFirstInteraction);
}

document.addEventListener("pointerdown", unlockAudioOnFirstInteraction, { once: true });
document.addEventListener("keydown", unlockAudioOnFirstInteraction, { once: true });

if (musicToggleBtn && music) {
    updateMusicToggleLabel();
    musicToggleBtn.addEventListener("click", () => {
        music.muted = !music.muted;
        if (!music.muted) playMusic();
        updateMusicToggleLabel();
    });
}

// ========= CONFETTI =========
function createConfettiPiece() {
    if (!confettiContainer) return;
    const piece = document.createElement("div");
    piece.classList.add("confetti-piece");

    const colors = ["#f97373", "#fb923c", "#facc15", "#4ade80", "#38bdf8", "#c4b5fd"];
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = 2.2 + Math.random() * 1.2 + "s";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;

    confettiContainer.appendChild(piece);
    setTimeout(() => piece.remove(), 3800);
}

function burstConfetti(count = 70, stepMs = 10) {
    for (let i = 0; i < count; i++) {
        setTimeout(createConfettiPiece, i * stepMs);
    }
}

// ========= BALLOONS =========
function createBalloon() {
    if (!balloonContainer) return;
    const balloon = document.createElement("div");
    balloon.classList.add("balloon");

    const colors = ["#f97373", "#fb923c", "#4ade80", "#38bdf8", "#f472b6", "#a855f7"];
    const size = 20 + Math.random() * 20;
    const sway = 2 + Math.random() * 4;

    balloon.style.left = Math.random() * 96 + "vw";
    balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.width = size + "px";
    balloon.style.height = size * 1.35 + "px";
    balloon.style.animationDuration = 5 + Math.random() * 3 + "s";
    balloon.style.setProperty("--sway", sway + "deg");

    const popBalloon = () => {
        balloon.classList.add("pop");
        setTimeout(() => balloon.remove(), 180);
    };

    balloon.addEventListener("click", popBalloon);
    if (Math.random() < 0.23) {
        setTimeout(popBalloon, 1300 + Math.random() * 1600);
    } else {
        setTimeout(() => balloon.remove(), 8400);
    }

    balloonContainer.appendChild(balloon);
}

function createTouchBalloon(x, y) {
    const balloon = document.createElement("div");
    balloon.classList.add("balloon");

    const colors = ["#f97373", "#fb923c", "#4ade80", "#38bdf8", "#f472b6", "#a855f7"];
    const size = 22 + Math.random() * 16;

    balloon.style.position = "fixed";
    balloon.style.left = `${x - size / 2}px`;
    balloon.style.top = `${y - size}px`;
    balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.width = `${size}px`;
    balloon.style.height = `${size * 1.35}px`;
    balloon.style.animation = "none";
    balloon.style.zIndex = "2300";
    balloon.style.pointerEvents = "none";

    document.body.appendChild(balloon);

    balloon.animate(
        [
            { transform: "translateY(0) scale(0.85)", opacity: 0.25 },
            { transform: "translateY(-55px) scale(1)", opacity: 1, offset: 0.45 },
            { transform: "translateY(-125px) scale(1.06)", opacity: 0 }
        ],
        { duration: 1200, easing: "ease-out", fill: "forwards" }
    );

    setTimeout(() => balloon.remove(), 1250);
}

// ========= TYPEWRITER =========
function runTypewriter() {
    if (!typewriterEl) return;
    const fullText = typewriterEl.dataset.text || "";
    let index = 0;
    typewriterEl.textContent = "";

    function typeChar() {
        if (index <= fullText.length) {
            typewriterEl.textContent = fullText.slice(0, index);
            index += 1;
            setTimeout(typeChar, 40);
        }
    }

    typeChar();
}

// ========= FIREWORKS =========
const fireworksCanvas = document.getElementById("fireworks-canvas");
const fireworksCtx = fireworksCanvas ? fireworksCanvas.getContext("2d") : null;
let fireworksRunning = false;
let fireworksAnimationId = null;
let lastLaunchTime = 0;
const rockets = [];
const sparks = [];

function resizeFireworksCanvas() {
    if (!fireworksCanvas) return;
    fireworksCanvas.width = fireworksCanvas.clientWidth;
    fireworksCanvas.height = fireworksCanvas.clientHeight;
}

function launchRocket() {
    if (!fireworksCanvas) return;
    rockets.push({
        x: Math.random() * fireworksCanvas.width,
        y: fireworksCanvas.height + 10,
        targetY: 60 + Math.random() * (fireworksCanvas.height * 0.5),
        speed: 5 + Math.random() * 2,
        hue: Math.floor(Math.random() * 360)
    });
}

function explodeRocket(rocket) {
    for (let i = 0; i < 22; i++) {
        const angle = (Math.PI * 2 * i) / 22;
        const velocity = 1 + Math.random() * 3;
        sparks.push({
            x: rocket.x,
            y: rocket.y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            life: 34 + Math.random() * 20,
            hue: rocket.hue
        });
    }
}

function drawFireworksFrame(timestamp) {
    if (!fireworksRunning || !fireworksCtx || !fireworksCanvas) return;
    fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    if (!lastLaunchTime || timestamp - lastLaunchTime > 420) {
        launchRocket();
        lastLaunchTime = timestamp;
    }

    for (let i = rockets.length - 1; i >= 0; i--) {
        const rocket = rockets[i];
        rocket.y -= rocket.speed;
        fireworksCtx.fillStyle = `hsla(${rocket.hue}, 100%, 70%, 0.45)`;
        fireworksCtx.fillRect(rocket.x, rocket.y, 2, 8);
        if (rocket.y <= rocket.targetY) {
            explodeRocket(rocket);
            rockets.splice(i, 1);
        }
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy += 0.03;
        spark.life -= 1;
        const alpha = Math.max(0, spark.life / 50) * 0.5;
        fireworksCtx.fillStyle = `hsla(${spark.hue}, 100%, 72%, ${alpha})`;
        fireworksCtx.fillRect(spark.x, spark.y, 2, 2);
        if (spark.life <= 0) sparks.splice(i, 1);
    }

    fireworksAnimationId = requestAnimationFrame(drawFireworksFrame);
}

function startFireworks() {
    if (!fireworksCanvas || !fireworksCtx || fireworksRunning) return;
    fireworksRunning = true;
    resizeFireworksCanvas();
    window.addEventListener("resize", resizeFireworksCanvas);
    fireworksAnimationId = requestAnimationFrame(drawFireworksFrame);
}

function stopFireworks() {
    if (!fireworksCanvas || !fireworksCtx) return;
    fireworksRunning = false;
    if (fireworksAnimationId) cancelAnimationFrame(fireworksAnimationId);
    fireworksAnimationId = null;
    rockets.length = 0;
    sparks.length = 0;
    fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    window.removeEventListener("resize", resizeFireworksCanvas);
}

// ========= SPARKLE TRAIL =========
let sparkleCooldown = 0;
function createSparkle(x, y) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = x + "px";
    sparkle.style.top = y + "px";
    sparkle.style.setProperty("--dx", `${-8 + Math.random() * 16}px`);
    sparkle.style.setProperty("--dy", `${-12 - Math.random() * 12}px`);
    sparkle.style.background = `hsl(${Math.floor(Math.random() * 360)}, 95%, 72%)`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 650);
}

document.addEventListener("pointermove", (event) => {
    if (currentScreen !== 4) return;
    const now = Date.now();
    if (now < sparkleCooldown) return;
    sparkleCooldown = now + 35;
    createSparkle(event.clientX, event.clientY);
});

document.addEventListener("pointerdown", (event) => {
    if (countdownOverlay?.classList.contains("show")) return;
    createTouchBalloon(event.clientX, event.clientY);
});

// ========= SURPRISE INTERACTIONS =========
if (giftBox) {
    const openGift = () => {
        giftBox.classList.toggle("open");
        if (giftMessage) giftMessage.classList.toggle("show");
        burstConfetti(36, 8);
    };
    giftBox.addEventListener("click", openGift);
    giftBox.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openGift();
        }
    });
}

let secretTapCount = 0;
let secretTapResetTimer = null;
if (secretTapBtn && secretReveal) {
    secretTapBtn.addEventListener("click", () => {
        secretTapCount += 1;
        if (secretTapResetTimer) clearTimeout(secretTapResetTimer);
        secretTapResetTimer = setTimeout(() => {
            secretTapCount = 0;
        }, 2200);

        if (secretTapCount >= 3) {
            secretReveal.classList.add("show");
            secretTapCount = 0;
            burstConfetti(56, 8);
        }
    });
}

// ========= CELEBRATION =========
function startCelebration() {
    runTypewriter();
    burstConfetti(120, 12);
    for (let i = 0; i < 22; i++) {
        setTimeout(createBalloon, i * 260);
    }
    startFireworks();
}

function runCountdown(onComplete, startAt = 10, stepMs = 1000) {
    if (!countdownOverlay || !countdownPanel || !countdownDays || !countdownHours || !countdownMinutes || !countdownSeconds) {
        if (typeof onComplete === "function") onComplete();
        return;
    }

    const setCountdownValues = (totalSeconds) => {
        const safeTotal = Math.max(0, Math.floor(totalSeconds));
        const days = Math.floor(safeTotal / 86400);
        const hours = Math.floor((safeTotal % 86400) / 3600);
        const minutes = Math.floor((safeTotal % 3600) / 60);
        const seconds = safeTotal % 60;
        countdownDays.textContent = String(days).padStart(2, "0");
        countdownHours.textContent = String(hours).padStart(2, "0");
        countdownMinutes.textContent = String(minutes).padStart(2, "0");
        countdownSeconds.textContent = String(seconds).padStart(2, "0");
    };

    const birthdayTargetMs = new Date(birthdayTargetISO).getTime();
    const useBirthdayTarget = Number.isFinite(birthdayTargetMs);

    countdownOverlay.classList.add("show");
    countdownOverlay.setAttribute("aria-hidden", "false");
    let count = startAt;
    let remainingSeconds = useBirthdayTarget
        ? Math.max(0, Math.ceil((birthdayTargetMs - Date.now()) / 1000))
        : startAt;
    setCountdownValues(remainingSeconds);
    countdownPanel.classList.remove("pulse");
    void countdownPanel.offsetWidth;
    countdownPanel.classList.add("pulse");

    const timer = setInterval(() => {
        if (useBirthdayTarget) {
            remainingSeconds = Math.max(0, Math.ceil((birthdayTargetMs - Date.now()) / 1000));
        } else {
            count -= 1;
            remainingSeconds = Math.max(0, count);
        }

        if (remainingSeconds >= 0) {
            setCountdownValues(remainingSeconds);
            countdownPanel.classList.remove("pulse");
            void countdownPanel.offsetWidth;
            countdownPanel.classList.add("pulse");
        }

        if (remainingSeconds > 0) {
            return;
        }

        clearInterval(timer);
        countdownOverlay.classList.remove("show");
        countdownOverlay.setAttribute("aria-hidden", "true");
        if (typeof onComplete === "function") onComplete();
    }, stepMs);
}

// ========= EVENT FLOW =========
if (startBtn) {
    startBtn.addEventListener("click", () => {
        showScreen(1);
        playMusic();
        burstConfetti(90, 9);
    });
}

if (envelope) {
    envelope.addEventListener("click", () => {
        envelope.classList.add("open");
        burstConfetti(70, 8);
        setTimeout(() => showScreen(2), 620);
    });
}

if (toCelebrationBtn) {
    toCelebrationBtn.addEventListener("click", () => {
        showScreen(3);
    });
}

if (toFinalBtn) {
    toFinalBtn.addEventListener("click", () => {
        showScreen(4);
        if (music) {
            music.volume = 1;
            playMusic();
        }
        burstConfetti(180, 8);
        startCelebration();
    });
}

if (replayBtn) {
    let replayInProgress = false;
    replayBtn.addEventListener("click", () => {
        if (replayInProgress) return;
        replayInProgress = true;
        replayBtn.disabled = true;
        document.body.classList.add("replay-cinematic");

        setTimeout(() => {
            if (confettiContainer) confettiContainer.innerHTML = "";
            if (balloonContainer) balloonContainer.innerHTML = "";
            if (typewriterEl) typewriterEl.textContent = "";
            stopFireworks();
            candleLit = false;
            if (flame) flame.classList.remove("lit");
            showScreen(0);
        }, 430);

        setTimeout(() => {
            document.body.classList.remove("replay-cinematic");
            replayBtn.disabled = false;
            replayInProgress = false;
        }, 980);
    });
}

// ========= CANDLE CLICK =========
const candle = document.querySelector(".candle");
const flame = document.querySelector(".flame");
let candleLit = false;

if (candle && flame) {
    candle.addEventListener("click", () => {
        candleLit = !candleLit;
        flame.classList.toggle("lit", candleLit);
        burstConfetti(candleLit ? 48 : 24, 8);
    });
}

// ========= LIGHTBOX =========
const heroPhoto = document.getElementById("hero-photo");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.querySelector(".lightbox-close");
let lightboxAutoCloseTimer = null;

function openLightbox(src, alt, autoCloseMs = 0) {
    if (!lightbox || !lightboxImg) return;
    if (lightboxAutoCloseTimer) {
        clearTimeout(lightboxAutoCloseTimer);
        lightboxAutoCloseTimer = null;
    }
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Photo";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    if (autoCloseMs > 0) {
        lightboxAutoCloseTimer = setTimeout(() => {
            closeLightbox();
        }, autoCloseMs);
    }
}

function closeLightbox() {
    if (!lightbox) return;
    if (lightboxAutoCloseTimer) {
        clearTimeout(lightboxAutoCloseTimer);
        lightboxAutoCloseTimer = null;
    }
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => {
        if (lightboxImg) lightboxImg.src = "";
    }, 220);
}

if (heroPhoto) {
    heroPhoto.addEventListener("click", () => {
        openLightbox(heroPhoto.src, heroPhoto.alt);
    });
}

const memoryPhotos = document.querySelectorAll(".memory-item img.memory-photo");
memoryPhotos.forEach((img) => {
    img.addEventListener("click", () => {
        img.closest(".memory-item")?.classList.add("is-selected");
        openLightbox(img.src, img.alt, 4000);
    });
});

const memoryItems = Array.from(document.querySelectorAll(".memory-item"));
let memoryParallaxX = 0;
let memoryParallaxY = 0;

memoryItems.forEach((item, index) => {
    const baseTilt = (index % 2 === 0 ? -1 : 1) * (1.2 + (index % 3) * 0.65);
    item.dataset.tilt = String(baseTilt);
});

document.addEventListener("pointermove", (event) => {
    if (currentScreen !== 3 || memoryItems.length === 0) return;
    const nx = (event.clientX / window.innerWidth - 0.5) * 2;
    const ny = (event.clientY / window.innerHeight - 0.5) * 2;
    memoryParallaxX = nx * 5.5;
    memoryParallaxY = ny * 4.5;
});

document.addEventListener("pointerleave", () => {
    memoryParallaxX = 0;
    memoryParallaxY = 0;
});

function animateMemoryPolaroids(timestamp) {
    if (memoryItems.length > 0) {
        const step4Active = currentScreen === 3;
        memoryItems.forEach((item, index) => {
            const phase = index * 0.8;
            const floatY = Math.sin(timestamp / 1100 + phase) * 4;
            const driftX = Math.cos(timestamp / 1450 + phase) * 1.2;
            const depth = 0.35 + (index % 5) * 0.08;
            const parallaxX = step4Active ? memoryParallaxX * depth : 0;
            const parallaxY = step4Active ? memoryParallaxY * depth : 0;
            const baseTilt = Number(item.dataset.tilt || 0);
            const tilt = baseTilt + (step4Active ? memoryParallaxX * 0.12 : 0);
            item.style.transform = `translate3d(${driftX + parallaxX}px, ${floatY + parallaxY}px, 0) rotate(${tilt}deg)`;
        });
    }

    requestAnimationFrame(animateMemoryPolaroids);
}

requestAnimationFrame(animateMemoryPolaroids);

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightbox) {
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox || event.target.classList.contains("lightbox-backdrop")) {
            closeLightbox();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
});

// ========= INITIAL STATE =========
runCountdown(() => {
    countdownFinished = true;
    if (audioUnlocked) playMusic();
    triggerScreenEntrance(screens[0]);
});
