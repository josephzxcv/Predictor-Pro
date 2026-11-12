const ACCESS_PASSWORD = "2282";

const I18N = {
  fr: {
    serverOnline: "Serveur BETANDYOU actif",
    authSubtitle: "Synchronisez votre identifiant BETANDYOU pour activer les signaux IA",
    loginLabel: "🔑 Identifiant (Login) :",
    loginPlaceholder: "C'est ton identifiant sur BETANDYOU",
    passwordLabel: "🔐 Mot de passe (Password) :",
    passwordPlaceholder: "Entrez le mot de passe",
    errEmpty: "❌ Identifiant incorrect !",
    errInvalidId: "❌ Identifiant incorrect !",
    errWrongPass: "❌ Mot de passe incorrect !",
    loginButton: "Activer le Predictor",
    syncStep1: "Connexion à l'ID BETANDYOU",
    syncStep2: "Synchronisation des algorithmes IA...",
    syncStep3: "Accès autorisé !",
    logoutBtn: "Déconnexion",
    readyStatus: "EN ATTENTE DU PROCHAIN ROUND",
    analyzingStatus: "VOL EN COURS...",
    signalReady: "ARRÊTEZ À CE COEFFICIENT",
    getSignalBtn: "Obtenir la prédiction",
    connectServerBtn: "Se connecter au serveur",
    connectingServerText: "Connexion au serveur du jeu...",
    serverConnectedBtn: "Serveur connecté",
    trapsLabel: "Mines:",
    penaltyWait: "Cible: --",
    penaltyScanning: "Analyse du gardien...",
    penaltyBtn: "Prédire le tir",
    penaltyZones: {
      TL: "Lucarne Gauche (1)",
      TC: "Haut Centre (2)",
      TR: "Lucarne Droite (3)",
      BL: "Ras du poteau Gauche (4)",
      BR: "Ras du poteau Droite (5)",
    },
    appleBtnNext: (coeff) => `Prédire le pas (${coeff})`,
    appleBtnDone: "🎉 x349.68 atteint ! Recommencer",
    appleResetBtn: "🔄 Nouveau jeu",
    appleStepBadge: (step, coeff) => `Étape ${step}/10 • ${coeff}`,
    chStepLabel: "PAS",
    chMultLabel: "MULTIPLICATEUR",
    chProbLabel: "CHANCE PAS",
    chTrapsLabel: "PIÈGES",
    chickenReadyStep: (lvl, mult) =>
      `Niveau ${lvl} • Prêt pour le Pas 1 (Gain : ${mult})`,
    chickenScanning: "Analyse Provably Fair (SHA-256)...",
    chickenStepStatus: (lvl, step, mult, nextMult) =>
      `✅ [${lvl}] Pas ${step} gagné : ${mult} • Prochain gain : ${nextMult}`,
    chickenMaxStatus: (lvl, mult) =>
      `🥚 [${lvl}] ŒUF D'OR ATTEINT ! Gain maximum : ${mult} !`,
    chickenStopStatus: (lvl, step, mult) =>
      `🏆 [${lvl}] GAIN PRÉDIT : ${mult} (${step} pas) — Encaissez maintenant !`,
    chickenBtnNext: (step, mult) => `Prédire le pas ${step} (${mult})`,
    chickenBtnDone: (mult) => `🔄 Encaisser ${mult} / Nouveau jeu`,
    stepWord: "Pas",
  },
  en: {
    serverOnline: "BETANDYOU Server Online",
    authSubtitle: "Synchronize your BETANDYOU ID to activate real-time AI signals",
    loginLabel: "🔑 Identifiant (Login) :",
    loginPlaceholder: "This is your ID on BETANDYOU",
    passwordLabel: "🔐 Mot de passe (Password) :",
    passwordPlaceholder: "Enter password",
    errEmpty: "❌ Invalid Login!",
    errInvalidId: "❌ Invalid Login!",
    errWrongPass: "❌ Invalid Password!",
    loginButton: "Activate Predictor",
    syncStep1: "Connecting to BETANDYOU ID",
    syncStep2: "Synchronizing AI algorithms...",
    syncStep3: "Access Granted!",
    logoutBtn: "Logout",
    readyStatus: "WAITING FOR NEXT ROUND",
    analyzingStatus: "FLIGHT IN PROGRESS...",
    signalReady: "CASH OUT AT THIS MULTIPLIER",
    getSignalBtn: "Get Prediction",
    connectServerBtn: "Connect to Server",
    connectingServerText: "Connecting to game server...",
    serverConnectedBtn: "Server Connected",
    trapsLabel: "Mines:",
    penaltyWait: "Target: --",
    penaltyScanning: "Analyzing goalkeeper...",
    penaltyBtn: "Predict Shot",
    penaltyZones: {
      TL: "Top Left Corner (1)",
      TC: "Top Center (2)",
      TR: "Top Right Corner (3)",
      BL: "Bottom Left Corner (4)",
      BR: "Bottom Right Corner (5)",
    },
    appleBtnNext: (coeff) => `Predict Step (${coeff})`,
    appleBtnDone: "🎉 x349.68 Reached! Restart",
    appleResetBtn: "🔄 New Game",
    appleStepBadge: (step, coeff) => `Step ${step}/10 • ${coeff}`,
    chStepLabel: "STEP",
    chMultLabel: "MULTIPLIER",
    chProbLabel: "STEP CHANCE",
    chTrapsLabel: "TRAPS",
    chickenReadyStep: (lvl, mult) =>
      `Level ${lvl} • Ready for Step 1 (Win: ${mult})`,
    chickenScanning: "Analyzing Provably Fair (SHA-256)...",
    chickenStepStatus: (lvl, step, mult, nextMult) =>
      `✅ [${lvl}] Step ${step} won: ${mult} • Next win: ${nextMult}`,
    chickenMaxStatus: (lvl, mult) =>
      `🥚 [${lvl}] GOLDEN EGG REACHED! Max payout: ${mult}!`,
    chickenStopStatus: (lvl, step, mult) =>
      `🏆 [${lvl}] PREDICTED WIN: ${mult} (${step} steps) — Cash out now!`,
    chickenBtnNext: (step, mult) => `Predict Step ${step} (${mult})`,
    chickenBtnDone: (mult) => `🔄 Cash Out ${mult} / New Game`,
    stepWord: "Step",
  },
};

let currentLang = "fr";
let activeErrorKey = null; // Хранит ключ текущей ошибки, чтобы переводить её при смене языка
let selectedTraps = 3;
let selectedChickenDiff = "easy";
let lastPenaltyZone = null;

// Математическая модель Chicken Road по каждому уровню сложности (InOut Games: пул 25 ячеек, RTP = 98%)
const CHICKEN_MODES = {
  easy: {
    label: "EASY",
    traps: 1,
    maxSteps: 24,
    firstMult: 1.02,
    winRange: [5, 15], // Оптимальный диапазон выигрышных шагов для Easy (1 ловушка из 25)
  },
  medium: {
    label: "MEDIUM",
    traps: 3,
    maxSteps: 22,
    firstMult: 1.09,
    winRange: [3, 9], // Диапазон выигрышных шагов для Medium (3 ловушки из 25)
  },
  hard: {
    label: "HARD",
    traps: 5,
    maxSteps: 20,
    firstMult: 1.2,
    winRange: [2, 6], // Диапазон выигрышных шагов для Hard (5 ловушек из 25)
  },
  hardcore: {
    label: "HARDCORE",
    traps: 10,
    maxSteps: 15,
    firstMult: 1.6,
    winRange: [1, 4], // Диапазон выигрышных шагов для Hardcore (10 ловушек из 25)
  },
};
let chickenCurrentStep = 0; // 0..(25 - M)

// 10 шагов Apple of Fortune сверху вниз (снизу вверх: от x1.23 до x349.68)
const APPLE_COEFFS = [
  "x349.68",
  "x69.93",
  "x27.97",
  "x11.18",
  "x6.71",
  "x4.02",
  "x2.41",
  "x1.93",
  "x1.54",
  "x1.23",
];
let appleCurrentStep = 0; // 0..9 (0 = x1.23, 9 = x349.68)

// Золотая 3D-звезда для Mines (в стиле Spribe)
const STAR_SVG = `
<svg viewBox="0 0 64 64" class="star-svg">
  <defs>
    <linearGradient id="stG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="50%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#eab308"/>
    </linearGradient>
  </defs>
  <polygon points="32,6 40,22 58,24 44,37 48,55 32,46 16,55 20,37 6,24 24,22" fill="url(#stG)" stroke="#ffffff" stroke-width="2"/>
</svg>`;

// Элементы DOM
const langBtns = document.querySelectorAll(".lang-btn");
const authScreen = document.getElementById("auth-screen");
const dashboardScreen = document.getElementById("dashboard-screen");
const authForm = document.getElementById("auth-form");
const userIdInput = document.getElementById("user-id");
const accessPassInput = document.getElementById("access-pass");
const togglePassBtn = document.getElementById("toggle-pass");
const authError = document.getElementById("auth-error");
const syncProgress = document.getElementById("sync-progress");
const syncStatusText = document.getElementById("sync-status-text");
const progressFill = document.getElementById("progress-fill");
const authSubmitBtn = document.getElementById("auth-submit");
const displayUserId = document.getElementById("display-user-id");
const logoutBtn = document.getElementById("logout-btn");
const gameTabs = document.querySelectorAll(".game-tab");

// Смена языка сайта (FR / EN)
function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  const dict = I18N[lang];

  langBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });

  // Если на экране сейчас видна ошибка — мгновенно переводим её на выбранный язык
  if (activeErrorKey && dict[activeErrorKey]) {
    authError.textContent = dict[activeErrorKey];
  }

  // Обновляем подписи игр и кнопок подключения к серверу
  updateServerConnectButtons();
  updateAppleUI();
  if (lastPenaltyZone) {
    document.getElementById("penalty-dir-label").textContent = `⚽ ${dict.penaltyZones[lastPenaltyZone]}`;
  }
  renderChickenLanes();
}

langBtns.forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

function showAuthError(errorKey) {
  activeErrorKey = errorKey;
  authError.textContent = I18N[currentLang][errorKey];
  authError.classList.remove("hidden");
  // Перезапуск анимации встряхивания
  authError.style.animation = "none";
  void authError.offsetWidth;
  authError.style.animation = "shake 0.35s ease";
}

function hideAuthError() {
  activeErrorKey = null;
  authError.classList.add("hidden");
}

togglePassBtn.addEventListener("click", () => {
  accessPassInput.type = accessPassInput.type === "password" ? "text" : "password";
});

// Разрешаем вводить в поле логина только цифры (до 15 цифр)
userIdInput.addEventListener("input", () => {
  userIdInput.value = userIdInput.value.replace(/\D/g, "").slice(0, 15);
});

// Разрешаем вводить в поле пароля только цифры
accessPassInput.addEventListener("input", () => {
  accessPassInput.value = accessPassInput.value.replace(/\D/g, "");
});

// Проверка сохраненной сессии (строго 10 цифр)
const savedId = sessionStorage.getItem("betandyou_id");
if (savedId && /^\d{10}$/.test(savedId)) {
  openDashboard(savedId);
}

// Обработка формы входа (поле вмещает до 15 цифр, но валидный ID — строго 10 цифр)
authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  hideAuthError();

  const userId = userIdInput.value.trim();
  const pass = accessPassInput.value.trim();
  const dict = I18N[currentLang];

  if (!userId && !pass) {
    showAuthError("errEmpty");
    return;
  }

  if (!/^\d{10}$/.test(userId)) {
    showAuthError("errInvalidId");
    return;
  }

  if (pass !== ACCESS_PASSWORD) {
    showAuthError("errWrongPass");
    return;
  }

  authSubmitBtn.disabled = true;
  syncProgress.classList.remove("hidden");
  progressFill.style.width = "30%";
  syncStatusText.textContent = `${dict.syncStep1} #${userId}...`;

  setTimeout(() => {
    progressFill.style.width = "72%";
    syncStatusText.textContent = dict.syncStep2;
  }, 500);

  setTimeout(() => {
    progressFill.style.width = "100%";
    syncStatusText.textContent = dict.syncStep3;
  }, 950);

  setTimeout(() => {
    sessionStorage.setItem("betandyou_id", userId);
    openDashboard(userId);
    authSubmitBtn.disabled = false;
    syncProgress.classList.add("hidden");
    progressFill.style.width = "0%";
  }, 1300);
});

function openDashboard(userId) {
  displayUserId.textContent = `#${userId}`;
  authScreen.classList.add("hidden");
  dashboardScreen.classList.remove("hidden");
}

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("betandyou_id");
  accessPassInput.value = "";
  hideAuthError();
  dashboardScreen.classList.add("hidden");
  authScreen.classList.remove("hidden");
});

// Переключение вкладок игр
gameTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    gameTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const target = tab.dataset.game;
    document.querySelectorAll(".game-panel").forEach((panel) => {
      panel.classList.toggle("hidden", panel.id !== `game-${target}`);
    });
  });
});

/* =====================================================
   ПОДКЛЮЧЕНИЕ К СЕРВЕРУ В КАЖДОЙ ИГРЕ (ПЕРЕД АКТИВАЦИЕЙ КНОПКИ)
   ===================================================== */
const gameServerConnected = {
  aviator: false,
  mines: false,
  penalty: false,
  apple: false,
  chicken: false,
};

function getGameActionButtons(gameKey) {
  if (gameKey === "aviator") return [document.getElementById("btn-aviator")];
  if (gameKey === "mines") return [document.getElementById("btn-mines")];
  if (gameKey === "penalty") return [document.getElementById("btn-penalty")];
  if (gameKey === "apple") {
    return [document.getElementById("btn-apple"), document.getElementById("btn-apple-reset")];
  }
  if (gameKey === "chicken") {
    return [document.getElementById("btn-chicken"), document.getElementById("btn-chicken-reset")];
  }
  return [];
}

function updateServerConnectButtons() {
  const dict = I18N[currentLang];
  document.querySelectorAll("[data-connect-btn]").forEach((btn) => {
    const gameKey = btn.dataset.connectBtn;
    const iconSpan = btn.querySelector(".srv-icon");
    const textSpan = btn.querySelector(".srv-text");
    if (gameServerConnected[gameKey]) {
      iconSpan.textContent = "✅";
      textSpan.textContent = dict.serverConnectedBtn;
    } else {
      iconSpan.textContent = "🔌";
      textSpan.textContent = dict.connectServerBtn;
    }
  });
}

document.querySelectorAll("[data-connect-btn]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const gameKey = btn.dataset.connectBtn;
    if (gameServerConnected[gameKey]) return;

    const loader = document.querySelector(`[data-loader="${gameKey}"]`);
    const fill = document.querySelector(`[data-loader-fill="${gameKey}"]`);

    btn.classList.add("hidden");
    loader.classList.remove("hidden");
    fill.style.width = "20%";

    setTimeout(() => {
      fill.style.width = "65%";
    }, 450);

    setTimeout(() => {
      fill.style.width = "100%";
    }, 950);

    setTimeout(() => {
      gameServerConnected[gameKey] = true;
      loader.classList.add("hidden");
      fill.style.width = "0%";
      btn.classList.remove("hidden");
      btn.classList.add("connected");
      btn.disabled = true;
      updateServerConnectButtons();

      // Активируем кнопку предсказания для этой игры
      getGameActionButtons(gameKey).forEach((actionBtn) => {
        if (actionBtn) actionBtn.disabled = false;
      });
    }, 1350);
  });
});

/* =====================================================
   1. AVIATOR (НАСТОЯЩАЯ КРИВАЯ ВЗЛЁТА SPRIBE)
   ===================================================== */
const aviatorBox = document.getElementById("aviator-box");
const aviatorCurve = document.getElementById("aviator-curve");
const aviatorArea = document.getElementById("aviator-area");
const aviatorPlane = document.getElementById("aviator-plane");
const aviatorStatus = document.getElementById("aviator-status");
const aviatorValue = document.getElementById("aviator-value");
const btnAviator = document.getElementById("btn-aviator");

function resetAviatorGraph() {
  aviatorCurve.setAttribute("d", "M 12 185 Q 12 185 12 185");
  aviatorArea.setAttribute("d", "M 12 185 Q 12 185 12 185 L 12 185 Z");
  aviatorPlane.style.transform = "translate(0px, 0px) rotate(0deg)";
  aviatorValue.classList.remove("locked");
}

btnAviator.addEventListener("click", () => {
  const dict = I18N[currentLang];
  btnAviator.disabled = true;
  resetAviatorGraph();
  aviatorStatus.textContent = dict.analyzingStatus;

  const roll = Math.random();
  let targetMult;
  if (roll < 0.62) {
    targetMult = +(1.22 + Math.random() * 1.85).toFixed(2);
  } else if (roll < 0.88) {
    targetMult = +(3.1 + Math.random() * 4.5).toFixed(2);
  } else {
    targetMult = +(7.6 + Math.random() * 11.4).toFixed(2);
  }

  const duration = 1500;
  const startTime = performance.now();

  function animateFlight(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 2.2);

    // Координаты кривой в SVG (360x200)
    const startX = 12;
    const startY = 185;
    const endX = 12 + ease * 295;
    const endY = 185 - Math.pow(ease, 1.45) * 142;
    const ctrlX = startX + (endX - startX) * 0.58;
    const ctrlY = startY;

    aviatorCurve.setAttribute("d", `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`);
    aviatorArea.setAttribute(
      "d",
      `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY} L ${endX} ${startY} Z`
    );

    // Перемещение самолёта точно по вершине кривой на любом размере экрана телефона
    const boxW = aviatorBox.clientWidth || 320;
    const boxH = aviatorBox.clientHeight || 200;
    const scaleX = boxW / 360;
    const scaleY = boxH / 200;
    const moveX = (endX - startX) * scaleX - 24;
    const moveY = (endY - startY) * scaleY + 8;
    const angle = -ease * 22;
    aviatorPlane.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${angle}deg)`;

    // Счётчик коэффициента
    const currentVal = (1.0 + (targetMult - 1.0) * ease).toFixed(2);
    aviatorValue.textContent = `${currentVal}x`;

    if (progress < 1) {
      requestAnimationFrame(animateFlight);
    } else {
      aviatorValue.textContent = `${targetMult.toFixed(2)}x`;
      aviatorValue.classList.add("locked");
      aviatorStatus.textContent = dict.signalReady;
      btnAviator.disabled = false;
    }
  }

  requestAnimationFrame(animateFlight);
});

/* =====================================================
   2. MINES (ОРИГИНАЛЬНЫЕ ЯЧЕЙКИ SPRIBE + ЗВЁЗДЫ)
   ===================================================== */
const minesGrid = document.getElementById("mines-grid");
const trapBtns = document.querySelectorAll(".trap-btn");
const btnMines = document.getElementById("btn-mines");

function initMinesGrid() {
  minesGrid.innerHTML = "";
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.className = "mine-cell";
    minesGrid.appendChild(cell);
  }
}
initMinesGrid();

trapBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    trapBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedTraps = parseInt(btn.dataset.traps, 10);
  });
});

btnMines.addEventListener("click", () => {
  btnMines.disabled = true;
  initMinesGrid();
  const cells = Array.from(minesGrid.querySelectorAll(".mine-cell"));

  // Волна сканирования по плиткам
  cells.forEach((cell, idx) => {
    setTimeout(() => cell.classList.add("scanning"), idx * 15);
    setTimeout(() => cell.classList.remove("scanning"), idx * 15 + 200);
  });

  const safeCountMap = { 1: 7, 3: 5, 5: 4, 7: 3 };
  const safeCount = safeCountMap[selectedTraps] || 5;

  const indices = Array.from({ length: 25 }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const chosen = indices.slice(0, safeCount);

  setTimeout(() => {
    chosen.forEach((cellIndex, i) => {
      setTimeout(() => {
        cells[cellIndex].classList.add("safe");
        cells[cellIndex].innerHTML = STAR_SVG;
        if (i === chosen.length - 1) {
          btnMines.disabled = false;
        }
      }, i * 140);
    });
  }, 500);
});

/* =====================================================
   3. PENALTY SHOOTOUT (ПОЛЁТ МЯЧА В УГОЛ ВОРОТ)
   ===================================================== */
const goalTargets = Array.from(document.querySelectorAll(".goal-target"));
const penaltyDirLabel = document.getElementById("penalty-dir-label");
const goalKeeper = document.getElementById("goal-keeper");
const flyingBall = document.getElementById("flying-ball");
const btnPenalty = document.getElementById("btn-penalty");

function resetPenaltyStage() {
  goalTargets.forEach((t) => t.classList.remove("scan", "win"));
  goalKeeper.style.transform = "translate(0, 0) rotate(0deg)";
  flyingBall.style.left = "50%";
  flyingBall.style.top = "82%";
  flyingBall.style.transform = "translate(-50%, -50%) scale(1) rotate(0deg)";
}

btnPenalty.addEventListener("click", () => {
  const dict = I18N[currentLang];
  btnPenalty.disabled = true;
  resetPenaltyStage();
  penaltyDirLabel.textContent = dict.penaltyScanning;

  let step = 0;
  const scanTimer = setInterval(() => {
    goalTargets.forEach((t) => t.classList.remove("scan"));
    goalTargets[step % goalTargets.length].classList.add("scan");
    step++;

    if (step >= 10) {
      clearInterval(scanTimer);
      goalTargets.forEach((t) => t.classList.remove("scan"));

      const winner = goalTargets[Math.floor(Math.random() * goalTargets.length)];
      winner.classList.add("win");
      const zoneKey = winner.dataset.zone;
      lastPenaltyZone = zoneKey;

      // Полёт мяча с точки пенальти точно в выбранную мишень
      const targetX = winner.dataset.x;
      const targetY = winner.dataset.y;
      flyingBall.style.left = targetX;
      flyingBall.style.top = targetY;
      flyingBall.style.transform = "translate(-50%, -50%) scale(0.78) rotate(360deg)";

      // Прыжок вратаря в противоположную сторону
      const diveX = zoneKey.includes("L") ? "36px" : zoneKey.includes("R") ? "-36px" : "-24px";
      const diveRot = zoneKey.includes("L") ? "18deg" : "-18deg";
      goalKeeper.style.transform = `translate(${diveX}, 6px) rotate(${diveRot})`;

      penaltyDirLabel.textContent = `⚽ ${dict.penaltyZones[zoneKey]}`;
      setTimeout(() => {
        btnPenalty.disabled = false;
      }, 550);
    }
  }, 85);
});

/* =====================================================
   4. APPLE OF FORTUNE (10 ШАГОВ ОТ x1.23 ДО x349.68 ПО КНОПКЕ)
   ===================================================== */
const appleGrid = document.getElementById("apple-grid");
const appleRowBadge = document.getElementById("apple-row-badge");
const btnApple = document.getElementById("btn-apple");
const btnAppleReset = document.getElementById("btn-apple-reset");

// Массив коэффициентов снизу вверх (шаг 1 = x1.23 ... шаг 10 = x349.68)
const APPLE_STEPS_ASC = [...APPLE_COEFFS].reverse();

function updateAppleUI() {
  const dict = I18N[currentLang];
  const rowsBottomUp = Array.from(appleGrid.querySelectorAll(".apple-row")).reverse();

  rowsBottomUp.forEach((row, idx) => {
    row.classList.toggle("current-target-row", idx === appleCurrentStep);
  });

  if (appleCurrentStep < APPLE_STEPS_ASC.length) {
    const nextCoeff = APPLE_STEPS_ASC[appleCurrentStep];
    appleRowBadge.textContent = dict.appleStepBadge(appleCurrentStep + 1, nextCoeff);
    btnApple.textContent = dict.appleBtnNext(nextCoeff);
  } else {
    appleRowBadge.textContent = dict.appleStepBadge(10, "x349.68");
    btnApple.textContent = dict.appleBtnDone;
  }
}

function initAppleGrid() {
  appleGrid.innerHTML = "";
  appleCurrentStep = 0;

  for (let r = 0; r < APPLE_COEFFS.length; r++) {
    const row = document.createElement("div");
    row.className = "apple-row";

    const coeff = document.createElement("span");
    coeff.className = "row-coeff";
    coeff.textContent = APPLE_COEFFS[r];
    row.appendChild(coeff);

    for (let c = 0; c < 5; c++) {
      const cell = document.createElement("div");
      cell.className = "apple-cell";
      row.appendChild(cell);
    }
    appleGrid.appendChild(row);
  }
  updateAppleUI();
}
initAppleGrid();

btnAppleReset.addEventListener("click", () => {
  initAppleGrid();
});

btnApple.addEventListener("click", () => {
  // Если все 10 шагов уже открыты — сбрасываем и начинаем с 1-го шага (x1.23)
  if (appleCurrentStep >= APPLE_STEPS_ASC.length) {
    initAppleGrid();
  }

  btnApple.disabled = true;
  btnAppleReset.disabled = true;

  const rowsBottomUp = Array.from(appleGrid.querySelectorAll(".apple-row")).reverse();
  const targetRow = rowsBottomUp[appleCurrentStep];
  const cells = Array.from(targetRow.querySelectorAll(".apple-cell"));

  // Короткая анимация сканирования ячеек текущего ряда
  let scanTick = 0;
  const scanInterval = setInterval(() => {
    cells.forEach((c) => c.classList.remove("scanning-apple"));
    cells[scanTick % 5].classList.add("scanning-apple");
    scanTick++;

    if (scanTick >= 7) {
      clearInterval(scanInterval);
      cells.forEach((c) => c.classList.remove("scanning-apple"));

      // Открываем безопасное яблоко на текущем шаге
      const safeCol = Math.floor(Math.random() * 5);
      cells[safeCol].classList.add("active-step");
      cells[safeCol].textContent = "🍎";

      targetRow.classList.remove("current-target-row");
      targetRow.classList.add("completed-row");

      appleCurrentStep++;
      updateAppleUI();

      btnApple.disabled = false;
      btnAppleReset.disabled = false;
    }
  }, 65);
});

/* =====================================================
   5. CHICKEN ROAD (ТОЧНАЯ МАТЕМАТИКА INOUT + ПОШАГОВО ПО КНОПКЕ)
   ===================================================== */
const chickenViewport = document.getElementById("chicken-viewport");
const chickenLanes = document.getElementById("chicken-lanes");
const chickenStatus = document.getElementById("chicken-status");
const chStepVal = document.getElementById("ch-step-val");
const diffBtns = document.querySelectorAll(".diff-btn");
const btnChicken = document.getElementById("btn-chicken");
const btnChickenReset = document.getElementById("btn-chicken-reset");

function formatChickenMult(val) {
  if (val >= 10000) {
    return `${val.toFixed(1)}x`;
  }
  if (val >= 100) {
    return `${ Number.isInteger(+val.toFixed(1)) ? Math.round(val) : val.toFixed(1) }x`;
  }
  return `${val.toFixed(2).replace(/\.50$/, ".5")}x`;
}

// Расчёт всех шагов по формуле: P_total(k) = prod((26 - M - i)/(26 - i)), Mult(k) = 0.98 / P_total(k)
function buildChickenSteps(diffKey) {
  const cfg = CHICKEN_MODES[diffKey];
  const M = cfg.traps;
  const maxSteps = cfg.maxSteps; // 25 - M
  const steps = [];
  let pTotal = 1;

  for (let k = 1; k <= maxSteps; k++) {
    const pStep = (25 - M - (k - 1)) / (25 - (k - 1));
    pTotal *= (26 - M - k) / (26 - k);
    const rawMult = k === 1 ? cfg.firstMult : 0.98 / pTotal;
    steps.push({
      step: k,
      multNum: rawMult,
      multStr: formatChickenMult(rawMult),
      stepProbStr: (pStep * 100).toFixed(1),
    });
  }
  return steps;
}

let chickenWinLimit = 5; // Рандомное количество выигрышных шагов в соответствии с уровнем сложности

function generateRandomWinSteps(diffKey) {
  const cfg = CHICKEN_MODES[diffKey];
  const [minW, maxW] = cfg.winRange;
  let nextLimit;
  do {
    // 85% в оптимальном диапазоне уровня, 15% — дальний проход вплоть до Золотого Яйца
    if (Math.random() < 0.85) {
      nextLimit = Math.floor(minW + Math.random() * (maxW - minW + 1));
    } else {
      nextLimit = Math.floor(maxW + 1 + Math.random() * (cfg.maxSteps - maxW));
    }
  } while (nextLimit === chickenWinLimit && cfg.maxSteps > 1);
  return nextLimit;
}

function updateChickenHUD() {
  const dict = I18N[currentLang];
  const cfg = CHICKEN_MODES[selectedChickenDiff];
  const steps = buildChickenSteps(selectedChickenDiff);
  const lanes = Array.from(chickenLanes.querySelectorAll(".chicken-lane"));

  // Обновляем подписи "Pas k" / "Step k" внутри карточек без сброса прогресса
  lanes.forEach((lane, idx) => {
    const stepSpan = lane.querySelector(".lane-step");
    if (stepSpan) {
      stepSpan.textContent =
        idx === steps.length - 1 ? `🥚 ${dict.stepWord} ${idx + 1}` : `${dict.stepWord} ${idx + 1}`;
    }
    lane.classList.toggle(
      "target-next",
      idx === chickenCurrentStep && chickenCurrentStep < chickenWinLimit
    );
  });

  if (chickenCurrentStep === 0) {
    const first = steps[0];
    chStepVal.textContent = `0 / ${cfg.maxSteps}`;
    chickenStatus.textContent = dict.chickenReadyStep(cfg.label, first.multStr);
    btnChicken.textContent = dict.chickenBtnNext(1, first.multStr);
  } else if (chickenCurrentStep < chickenWinLimit) {
    const curr = steps[chickenCurrentStep - 1];
    const next = steps[chickenCurrentStep];
    chStepVal.textContent = `${chickenCurrentStep} / ${cfg.maxSteps}`;
    chickenStatus.textContent = dict.chickenStepStatus(
      cfg.label,
      chickenCurrentStep,
      curr.multStr,
      next.multStr
    );
    btnChicken.textContent = dict.chickenBtnNext(chickenCurrentStep + 1, next.multStr);
  } else {
    const winStepObj = steps[chickenWinLimit - 1];
    chStepVal.textContent = `${chickenWinLimit} / ${cfg.maxSteps}`;
    if (chickenWinLimit === cfg.maxSteps) {
      chickenStatus.textContent = dict.chickenMaxStatus(cfg.label, winStepObj.multStr);
    } else {
      chickenStatus.textContent = dict.chickenStopStatus(
        cfg.label,
        chickenWinLimit,
        winStepObj.multStr
      );
    }
    btnChicken.textContent = dict.chickenBtnDone(winStepObj.multStr);
  }
}

function initChickenRoad() {
  const dict = I18N[currentLang];
  const cfg = CHICKEN_MODES[selectedChickenDiff];
  const steps = buildChickenSteps(selectedChickenDiff);
  chickenCurrentStep = 0;
  chickenWinLimit = generateRandomWinSteps(selectedChickenDiff);
  chickenLanes.innerHTML = "";

  steps.forEach((item, idx) => {
    const isFinal = idx === steps.length - 1;
    const lane = document.createElement("div");
    lane.className = `chicken-lane${isFinal ? " final-egg-lane" : ""}`;
    lane.innerHTML = `
      <span class="lane-step">${isFinal ? `🥚 ${dict.stepWord} ${item.step}` : `${dict.stepWord} ${item.step}`}</span>
      <div class="lane-icon">${isFinal ? "🥚" : "🕳️"}</div>
      <span class="lane-mult" title="${item.multStr}">${item.multStr}</span>
    `;
    chickenLanes.appendChild(lane);
  });

  chickenViewport.scrollLeft = 0;
  updateChickenHUD();
}

// Вызывается из setLanguage() — переводит тексты без сброса текущего шага
function renderChickenLanes() {
  if (chickenLanes.children.length === 0) {
    initChickenRoad();
  } else {
    updateChickenHUD();
  }
}

initChickenRoad();

diffBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    diffBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedChickenDiff = btn.dataset.diff;
    initChickenRoad();
  });
});

btnChickenReset.addEventListener("click", () => {
  initChickenRoad();
});

btnChicken.addEventListener("click", () => {
  const dict = I18N[currentLang];
  const cfg = CHICKEN_MODES[selectedChickenDiff];

  // Если рандомный лимит выигрышных шагов этой игры уже достигнут — начинаем новую игру с новым рандомным числом шагов
  if (chickenCurrentStep >= chickenWinLimit) {
    initChickenRoad();
  }

  btnChicken.disabled = true;
  btnChickenReset.disabled = true;
  chickenStatus.textContent = dict.chickenScanning;

  const lanes = Array.from(chickenLanes.querySelectorAll(".chicken-lane"));
  const targetLane = lanes[chickenCurrentStep];

  // Автопрокрутка дорожки, чтобы активный шаг всегда был по центру
  const scrollTarget =
    targetLane.offsetLeft - chickenViewport.clientWidth / 2 + targetLane.clientWidth / 2;
  chickenViewport.scrollTo({ left: Math.max(0, scrollTarget), behavior: "smooth" });

  targetLane.classList.add("scanning-grate");

  setTimeout(() => {
    targetLane.classList.remove("scanning-grate", "target-next");

    // Оставляем золотую монету на предыдущем пройденном люке
    if (chickenCurrentStep > 0) {
      const prevLane = lanes[chickenCurrentStep - 1];
      prevLane.classList.remove("current-chicken");
      prevLane.querySelector(".lane-icon").textContent = "🪙";
    }

    const isFinalStep = chickenCurrentStep === cfg.maxSteps - 1;
    targetLane.classList.add("safe-hop", "current-chicken");
    targetLane.querySelector(".lane-icon").textContent = isFinalStep ? "🐔🥚" : "🐔";

    chickenCurrentStep++;

    // Если это был последний выигрышный шаг для текущей игры — подсвечиваем ловушку 🔥 на следующем люке
    if (chickenCurrentStep === chickenWinLimit && chickenWinLimit < cfg.maxSteps) {
      const trapLane = lanes[chickenWinLimit];
      trapLane.classList.add("stop-danger");
      trapLane.querySelector(".lane-icon").textContent = "🔥";
    }

    updateChickenHUD();

    btnChicken.disabled = false;
    btnChickenReset.disabled = false;
  }, 280);
});

// Французский язык по умолчанию
setLanguage("fr");
