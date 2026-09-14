const cases = [
    {
        type: "intro",
        title: "Informe de Misión Inicial",
        story: "Contexto asignado al Agente Juan."
    },
    {
        type: "quiz2",
        title: "Fase 1: Validación de Rango (Pregunta)",
        story: "El sistema exige una verificación de estatus vital para confirmar tu autorización como el cumpleañero oficial.",
        question: "¿Qué es lo que más le gusta de ti al sistema central (y a mí)?",
        options: [
            "A) Tu inteligencia, disciplina y la dedicación que le pones a todo lo que haces.",
            "B) La forma tan bonita en la que siempre me motivas a ser mejor persona.",
            "C) Tu sonrisa única, tus manos y tus brazotes.",
            "D) Tus ocurrencias y cómo compartimos la misma neurona todo el tiempo."
        ],
        correct: 1,
        reward: " <p>¡Rango y datos validados con éxito! Habilitando siguiente nivel de seguridad!.</p> <p> <strong>Pista del Regalo #1:</strong> Tu primera recompensa está camuflada muy cerca de donde estudias.</p>"
    },
    {
        type: "dino",
        title: "Fase 2: Protocolo de Salto Digital (Esquiva los objetos)",
        story: "Esquiva los obstáculos usando la <strong>barra espaciadora</strong> o haciendo clic.<br> - Bombas = 1 punto<br> - Torta = 2 puntos<br> Alcanza <strong>30 puntos</strong> para superar la fase.",
        reward: "<p>¡Reflejos calibrados con éxito! El sistema está listo para la fiesta.</p> <p><strong>Pista del Regalo #2:</strong> El siguiente objeto está guardado donde guardas tus prendas favoritas.</p>"
    },
    {
        type: "hangman",
        title: "Fase 3: Protocolo de Descifrado (Descifrar Frase)",
        story: "Descifra la frase secreta de cumpleaños seleccionando las letras correctas en el teclado virtual. Tienes un límite de 3 errores antes de que se active la alerta.",
        reward: "<p>¡Frase descifrada con éxito!</p> <p><strong>Pista del Regalo #3:</strong> El sistema indica que este paquete se encuentra con la comida de uno de nuestros agentes."
    },
    {
        type: "pacman",
        title: "Fase 4: Laberinto (Dog-Man)",
        story: "Usa las <strong>flechas del teclado</strong> para moverte y recolectar todos los puntos. ¡Busca las fichas especiales de energía para eliminar el 10% de los puntos restantes! Si te atrapan, reaparecerá el <strong>50% de los puntos</strong>.",
        reward: "<p>¡Laberinto superado! Estás más cerca de la evidencia final.</p> <p><strong>Pista del Regalo #4:</strong> Este artículo está en un lugar donde siempre huele a jabón y agua corriendo.</p>"
    },
    {
        type: "wordsearch",
        title: "Fase 5: Matriz de Cripto-Análisis (Sopa de letras)",
        story: "Extrae las 12 palabras clave de la matriz. <br><br><strong>Instrucción:</strong> Haz clic en las letras en orden. Las activas se pondrán <strong>Rojas</strong> y al completar una palabra se quedarán <strong>Verdes</strong>.",
        reward: "<p>¡Matriz descifrada! Estás a un paso de la evidencia final.</p> <p><strong>Pista del Regalo #5:</strong> El agente encargado de entregarte este paquete duerme contigo todas las noches.</p>"
    },
    {
        type: "puzzle",
        title: "Fase 6: Reconstrucción de Evidencia Final (Archivo de cumpleaños)",
        story: "Fase final. Rearma la imagen para desbloquear la ubicación definitiva y la sorpresa final.",
        reward: "¡EXPEDIENTE COMPLETADO!"
    }
];

let currentCaseIndex = 0;
let isModalOpen = false;
let currentModalMode = "proceed"; 
const gameContainer = document.getElementById("gameContainer");
const progressFill = document.getElementById("progressFill");

function loadCase() {
    stopGhostInterval();
    stopDinoGame();
    if (currentCaseIndex >= cases.length) {
        currentCaseIndex = cases.length - 1;
    }
    
    let progressPercentage = (currentCaseIndex / (cases.length - 1)) * 100;
    progressFill.style.width = `${progressPercentage}%`;

    const currentCase = cases[currentCaseIndex];
    
    if (currentCase.type === "intro") loadIntroScreen(currentCase);
    else if (currentCase.type === "quiz2") loadQuizGame(currentCase);
    else if (currentCase.type === "dino") loadDinoIntro(currentCase);
    else if (currentCase.type === "hangman") loadHangmanGame(currentCase);
    else if (currentCase.type === "pacman") loadPacmanIntro(currentCase);
    else if (currentCase.type === "wordsearch") loadWordSearchGame(currentCase);
    else if (currentCase.type === "puzzle") loadPuzzleGame(currentCase);
}

function skipCurrentLevel() {
    if (isModalOpen) return;
    stopGhostInterval();
    stopDinoGame();
    let isFinal = (currentCaseIndex === cases.length - 1);
    
    if (isFinal) {
        showModal(
            "PROTOCOLO OMEGA: MISIÓN CUMPLIDA", 
            "<strong>Informe:</strong> ¡Excelente trabajo, Agente Juan! Has superado todos los cortafuegos, demostrado tus habilidades y asegurado tu expediente de cumpleaños a tiempo. La brecha festiva ha sido oficialmente abierta.<br><br><strong>Transmisión entrante:</strong> Un momento... la Agencia ha interceptado un archivo multimedia cifrado de última hora. Alguien quiere darte un mensaje personal por lograrlo.", 
            "final"
        );
    } else {
        currentCaseIndex++;
        loadCase();
    }
}

function showModal(title, message, mode = "proceed") {
    stopGhostInterval();
    stopDinoGame();
    isModalOpen = true;
    currentModalMode = mode;

    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalContent').innerHTML = message;
    
    const riddleBox = document.getElementById('modalRiddleBox');
    const loveMsg = document.getElementById('modalLoveMsg');
    const videoContainer = document.getElementById('modalVideoContainer');
    const btn = document.getElementById('modalBtn');
    const cardBox = document.getElementById('victoryCardBox');

    cardBox.classList.remove('error-card');
    riddleBox.classList.add('hidden');
    loveMsg.style.display = 'none';
    videoContainer.classList.add('hidden');

    let vid = document.getElementById('finalVideo');
    vid.pause();
    vid.currentTime = 0;

    if (mode === "retry") {
        cardBox.classList.add('error-card');
        btn.style.backgroundColor = 'var(--error-color)';
        btn.textContent = "REINTENTAR FASE";
    } else if (mode === "final") {
        btn.style.backgroundColor = 'var(--accent-color)';
        btn.textContent = "[ ▶ REPRODUCIR MENSAJE OCULTO ]";
    } else if (mode === "video_playing") {
        btn.style.backgroundColor = 'var(--success-color)';
        btn.textContent = "FINALIZAR Y REINICIAR MISIÓN";
        riddleBox.classList.remove('hidden');
        loveMsg.style.display = 'block';
        videoContainer.classList.remove('hidden');
        vid.play();
    } else {
        btn.style.backgroundColor = 'var(--accent-color)';
        btn.textContent = "SIGUIENTE FASE";
    }

    document.getElementById('modalOverlay').classList.remove('hidden');
}

function modalAction() {
    let vid = document.getElementById('finalVideo');

    if (currentModalMode === "final") {
        showModal(
            "PROTOCOLO OMEGA: MISIÓN CUMPLIDA", 
            "<strong>Transmisión en curso:</strong> Reproduciendo archivo multimedia interceptado...", 
            "video_playing"
        );
        return;
    }

    document.getElementById('modalOverlay').classList.add('hidden');
    isModalOpen = false;
    vid.pause();
    vid.currentTime = 0;

    if (currentModalMode === "retry") {
        loadCase();
    } else if (currentModalMode === "video_playing") {
        location.reload();
    } else {
        currentCaseIndex++;
        if (currentCaseIndex < cases.length) {
            loadCase();
        }
    }
}

function handleGlobalKeyDown(e) {
    if (isModalOpen) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            modalAction();
        }
        return;
    }

    if (cases[currentCaseIndex].type === "pacman" && pacmanGameStarted) {
        handlePacMove(e);
    } else if (cases[currentCaseIndex].type === "dino" && dinoGameStarted) {
        if (e.key === " " || e.key === "ArrowUp") {
            e.preventDefault();
            triggerDinoJump();
        }
    }
}

// --- INTRO ---
function loadIntroScreen(currentCase) {
    gameContainer.innerHTML = `
        <div class="intro-screen">
            <div class="info-panel" style="text-align: centre; min-height: auto;">
                <div>
                    <h2>EXPEDIENTE DE MISIÓN: CLASIFICADO (NIVEL: 30)</h2>
                    <div class="intro-box">
                        <p>Atención, Agente <span>Juan</span>. La Agencia Central ha interceptado una anomalía crítica en el servidor: ¡hoy se celebra un nuevo año de vida del agente y el sistema requiere una validación especial!.</p>
                        <p>Tu misión consiste en infiltrarte en los subsistemas de seguridad, superar los cortafuegos de acceso y descifrar los protocolos ocultos para desbloquear las coordenadas de tus regalos de cumpleaños antes de que el sistema se bloquee.</p>
                        <p>El éxito de la operación depende enteramente de tus habilidades. ¿Estás listo para iniciar la celebración, Agente Juan?</p>
                    </div>
                </div>
            </div>
            <button onclick="nextFromIntro()">INICIAR PROTOCOLO DE CUMPLEAÑOS </button>
        </div>
    `;
}

function nextFromIntro() {
    currentCaseIndex++;
    loadCase();
}

// --- QUIZ ---
function loadQuizGame(currentCase) {
    let optionsHtml = "";
    currentCase.options.forEach((opt, idx) => {
        optionsHtml += `<button class="quiz-option" onclick="checkQuizAnswer(${idx}, ${currentCase.correct})">${opt}</button>`;
    });

    gameContainer.innerHTML = `
        <div class="game-layout">
            <div class="info-panel">
                <div>
                    <h2>${currentCase.title}</h2>
                    <p class="story">${currentCase.story}</p>
                </div>
                <button class="skip-btn" onclick="skipCurrentLevel()">skip</button>
            </div>
            <div class="workspace-panel">
                <div style="font-weight: bold; margin-bottom: 15px; text-align: center; color: var(--text-color);">${currentCase.question}</div>
                <div class="quiz-container">${optionsHtml}</div>
                <div id="quizFeedback" class="feedback"></div>
            </div>
        </div>
    `;
}

function checkQuizAnswer(selected, correct) {
    if (isModalOpen) return;
    let currentCase = cases[currentCaseIndex];
    if (selected === correct) {
        showModal("🔓 ACCESO CONCEDIDO 🔓", currentCase.reward, "proceed");
    } else {
        let fb = document.getElementById("quizFeedback");
        if (fb) fb.textContent = "❌ Respuesta incorrecta. Inténtalo de nuevo.";
    }
}

// --- DINOSAURIO ---
let dinoInterval = null;
let dinoScore = 0;
let isJumping = false;
let dinoPosY = 0;
let obstaclePosX = 520;
let currentObstacleType = 0; 
let dinoGameStarted = false;
const targetDinoScore = 30;

function loadDinoIntro(currentCase) {
    stopDinoGame();
    dinoGameStarted = false;
    gameContainer.innerHTML = `
        <div class="game-layout">
            <div class="info-panel">
                <div>
                    <h2>${currentCase.title}</h2>
                    <p class="story">
                        Lee atentamente antes de empezar:<br><br>
                        Usa la <strong>barra espaciadora</strong> o haz clic para saltar.<br>
                        - Bombas = <strong>1 punto</strong>.<br>
                        - Torta = <strong>2 puntos</strong>.<br>
                        Consigue <strong>30 puntos</strong> para superar la fase.
                    </p>
                </div>
                <button class="skip-btn" onclick="skipCurrentLevel()">skip</button>
            </div>
            <div class="workspace-panel">
                <div style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <p style="color: #fbbf24; font-weight: bold; margin: 0;">¡Calibración lista para arrancar!</p>
                    <button onclick="startDinoGameSession()" style="width: auto; padding: 15px 30px; font-size: 1.1rem; background-color: var(--success-color); color: #fff;">INICIAR JUEGO</button>
                </div>
            </div>
        </div>
    `;
}

function startDinoGameSession() {
    dinoGameStarted = true;
    dinoScore = 0;
    isJumping = false;
    dinoPosY = 0;
    obstaclePosX = 520;
    currentObstacleType = 0;

    let currentCase = cases[currentCaseIndex];
    gameContainer.innerHTML = `
        <div class="game-layout">
            <div class="info-panel">
                <div>
                    <h2>${currentCase.title}</h2>
                    <p class="story">${currentCase.story}</p>
                    <p style="color: #fbbf24; font-weight: bold;">Puntuación: <span id="dinoScoreDisplay">0</span> / ${targetDinoScore}</p>
                </div>
                <button class="skip-btn" onclick="skipCurrentLevel()">skip</button>
            </div>
            <div class="workspace-panel">
                <div class="dino-game-container" onclick="triggerDinoJump()">
                    <video class="dino-bg-video" autoplay muted loop playsinfile>
                        <source src="video-bg.mp4" type="video/mp4">
                    </video>
                    <div class="dino-ground"></div>
                    <img id="dinoPlayer" class="dino-element" src="dino.png" alt="Dino" style="bottom: 4px;">
                    <img id="dinoObstacle" class="dino-element" src="cactus.png" alt="Obstaculo" style="right: -50px;">
                </div>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 10px; text-align: center;">Presiona Barra Espaciadora o haz clic para saltar</p>
            </div>
        </div>
    `;
    startDinoLoop();
}

function stopDinoGame() {
    if (dinoInterval) {
        clearInterval(dinoInterval);
        dinoInterval = null;
    }
}

function triggerDinoJump() {
    if (isModalOpen || !dinoGameStarted || isJumping) return;
    isJumping = true;
    let jumpCount = 0;
    let jumpInterval = setInterval(() => {
        if (jumpCount < 18) {
            dinoPosY += 9.5; 
        } else if (jumpCount < 36) {
            dinoPosY -= 9.5;
        } else {
            clearInterval(jumpInterval);
            dinoPosY = 0;
            isJumping = false;
        }
        let playerEl = document.getElementById("dinoPlayer");
        if (playerEl) playerEl.style.bottom = `${4 + dinoPosY}px`;
        jumpCount++;
    }, 18);
}

function updateObstacleVisuals() {
    let obsEl = document.getElementById("dinoObstacle");
    if (!obsEl) return;
    
    if (currentObstacleType === 0) {
        obsEl.src = "cactus.png";
        obsEl.style.width = "50px";
        obsEl.style.height = "65px";
        obsEl.style.bottom = "4px";
    } else {
        obsEl.src = "ptero.png";
        obsEl.style.width = "65px";
        obsEl.style.height = "45px";
        obsEl.style.bottom = "75px"; 
    }
}

function startDinoLoop() {
    stopDinoGame();
    let obstacleSpeed = 6.0; 
    dinoInterval = setInterval(() => {
        if (isModalOpen || !dinoGameStarted) return;

        obstaclePosX += obstacleSpeed;
        if (obstaclePosX > 540) {
            let pointsToAdd = (currentObstacleType === 1) ? 2 : 1;
            dinoScore += pointsToAdd;

            obstaclePosX = -50;
            currentObstacleType = Math.random() > 0.6 ? 1 : 0;
            updateObstacleVisuals();

            let scoreEl = document.getElementById("dinoScoreDisplay");
            if (scoreEl) scoreEl.textContent = dinoScore;

            if (dinoScore >= targetDinoScore) {
                stopDinoGame();
                showModal("⚡ ACCESO CONCEDIDO", cases[currentCaseIndex].reward, "proceed");
                return;
            }
        }

        let obsEl = document.getElementById("dinoObstacle");
        if (obsEl) obsEl.style.right = `${obstaclePosX}px`;

        let obsWidth = (currentObstacleType === 1) ? 65 : 50;
        let obsLeft = 500 - obstaclePosX - obsWidth;
        let obsRight = 500 - obstaclePosX;
        
        let dinoLeft = 40 + 35; 
        let dinoRight = 40 + 110 - 35;

        if (obsRight > dinoLeft && obsLeft < dinoRight) {
            if (currentObstacleType === 1) {
                let pteroLeft = (500 - obstaclePosX) - 65 + 20;
                let pteroRight = (500 - obstaclePosX) - 20;
                if (pteroRight > dinoLeft && pteroLeft < dinoRight) {
                    if (dinoPosY < 50 && dinoPosY > 15) {
                        stopDinoGame();
                        showModal("⚠️ ALERTA DE SISTEMA", "¡Colisión detectada con la torta!", "retry");
                    }
                }
            } else {
                if (dinoPosY < 35) {
                    stopDinoGame();
                    showModal("⚠️ ALERTA DE SISTEMA", "¡Colisión detectada con las bombas!", "retry");
                }
            }
        }
    }, 25);
}

// --- AHORCADO ---
const hangmanPhrase = "YA ME EMOCIONA COMPRAR SARTENES";
let guessedLetters = new Set();
let wrongAttempts = 0;
const maxWrong = 3;

function loadHangmanGame(currentCase) {
    guessedLetters = new Set([' ']);
    wrongAttempts = 0;
    renderHangmanBoard(currentCase);
}

function renderHangmanBoard(currentCase) {
    let words = hangmanPhrase.split(" ");
    let wordHtml = "";

    words.forEach(word => {
        wordHtml += `<div class="hangman-word-group">`;
        for (let char of word) {
            let displayChar = guessedLetters.has(char) ? char : "";
            wordHtml += `<div class="hangman-letter-box">${displayChar}</div>`;
        }
        wordHtml += `</div>`;
    });

    let alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    let keyboardHtml = "";
    for (let letter of alphabet) {
        let disabled = guessedLetters.has(letter) ? "disabled" : "";
        keyboardHtml += `<button class="hangman-key" ${disabled} onclick="guessHangmanLetter('${letter}')">${letter}</button>`;
    }

    let currentImg = "bien.jpeg";
    if (wrongAttempts === 1) currentImg = "error1.jpeg";
    else if (wrongAttempts === 2) currentImg = "error2.jpeg";
    else if (wrongAttempts >= 3) currentImg = "error3.jpeg";

    gameContainer.innerHTML = `
        <div class="game-layout">
            <div class="info-panel">
                <div>
                    <h2>${currentCase.title}</h2>
                    <p class="story">${currentCase.story}</p>
                    <p style="color: var(--accent-color); font-weight: bold;">Errores: <span id="hangmanErrors">${wrongAttempts}</span> / ${maxWrong}</p>
                </div>
                <button class="skip-btn" onclick="skipCurrentLevel()">skip</button>
            </div>
            <div class="workspace-panel">
                <div class="hangman-container-spaced">
                    <div class="hangman-image-container">
                        <img id="hangmanImg" src="${currentImg}" alt="Estado actual">
                    </div>
                    <div class="hangman-club-title">Bienvenido al club de:</div>
                    <div class="hangman-word-container">${wordHtml}</div>
                    <div class="hangman-keyboard">${keyboardHtml}</div>
                </div>
            </div>
        </div>
    `;
}

function guessHangmanLetter(letter) {
    if (isModalOpen) return;
    guessedLetters.add(letter);
    if (!hangmanPhrase.includes(letter)) {
        wrongAttempts++;
    }

    let currentCase = cases[currentCaseIndex];
    renderHangmanBoard(currentCase);

    let won = true;
    for (let char of hangmanPhrase) {
        if (!guessedLetters.has(char)) {
            won = false;
            break;
        }
    }

    if (won) {
        showModal("⚡ ACCESO CONCEDIDO", currentCase.reward, "proceed");
    } else if (wrongAttempts >= maxWrong) {
        showModal("⚠️ ALERTA DE SISTEMA", "¡Llegaste al límite de 3 errores! Has perdido el acceso.", "retry");
    }
}

// --- PAC-MAN ---
let originalPacMap = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
let pacMap = [];
let playerPos = { r: 1, c: 1 };
let ghosts = [];
let ghostInterval = null;
let totalDots = 0;
let dotsEaten = 0;
let pacmanGameStarted = false;

function loadPacmanIntro(currentCase) {
    stopGhostInterval();
    pacmanGameStarted = false;
    pacMap = originalPacMap.map(row => [...row]);
    
    let powerCoords = [
        {r: 1, c: 13}, 
        {r: 7, c: 13}, 
        {r: 13, c: 13},
        {r: 1, c: 3}, 
        {r: 1, c: 23}, 
        {r: 13, c: 3}, 
        {r: 13, c: 23}
    ];
    powerCoords.forEach(p => {
        if (pacMap[p.r][p.c] === 0) pacMap[p.r][p.c] = 4;
    });

    playerPos = { r: 1, c: 1 };
    ghosts = [
        { r: 1, c: 25 },
        { r: 13, c: 1 },
        { r: 7, c: 13 }
    ];
    
    countTotalDots();
    renderPacmanIntroScreen(currentCase);
}

function renderPacmanIntroScreen(currentCase) {
    gameContainer.innerHTML = `
        <div class="game-layout">
            <div class="info-panel">
                <div>
                    <h2>${currentCase.title}</h2>
                    <p class="story">
                        Lee atentamente las instrucciones antes de empezar:<br><br>
                        - Usa las <strong>flechas del teclado</strong> para moverte.<br>
                        - Come las fichas de energía para borrar automáticamente el 10% de los puntos restantes del tablero.<br>
                        - Los poyos irán rápido y te perseguirán, pero <strong>no se moverán hasta que hagas clic en el botón de iniciar</strong>.<br>
                        - Si te atrapan, se restablecerá el 50% de los puntos que ya habías comido.
                    </p>
                </div>
                <button class="skip-btn" onclick="skipCurrentLevel()">skip</button>
            </div>
            <div class="workspace-panel">
                <div style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 20px;">
                    <p style="color: #fbbf24; font-weight: bold; margin: 0;">¡Todo listo para la infiltración!</p>
                    <button onclick="startPacmanGame()" style="width: auto; padding: 15px 30px; font-size: 1.1rem; background-color: var(--success-color); color: #fff;">INICIAR JUEGO</button>
                </div>
            </div>
        </div>
    `;
}

function startPacmanGame() {
    pacmanGameStarted = true;
    renderPacmanBoard(cases[currentCaseIndex]);
    startGhostInterval();
}

function countTotalDots() {
    totalDots = 0;
    dotsEaten = 0;
    for (let r = 0; r < pacMap.length; r++) {
        for (let c = 0; c < pacMap[r].length; c++) {
            if (pacMap[r][c] === 0 || pacMap[r][c] === 4) totalDots++;
        }
    }
}

function stopGhostInterval() {
    if (ghostInterval) {
        clearInterval(ghostInterval);
        ghostInterval = null;
    }
}

function startGhostInterval() {
    stopGhostInterval();
    ghostInterval = setInterval(() => {
        let pacmanIndex = cases.findIndex(c => c.type === "pacman");
        if (isModalOpen || currentCaseIndex !== pacmanIndex || !pacmanGameStarted) {
            stopGhostInterval();
            return;
        }

        let occupiedPositions = new Set();

        ghosts.forEach(g => {
            let directions = [
                {r: -1, c: 0}, {r: 1, c: 0}, 
                {r: 0, c: -1}, {r: 0, c: 1}
            ];
            let validMoves = directions.filter(d => {
                let nr = g.r + d.r;
                let nc = g.c + d.c;
                return pacMap[nr] && pacMap[nr][nc] !== undefined && pacMap[nr][nc] !== 1;
            });

            if (validMoves.length > 0) {
                validMoves.sort((a, b) => {
                    let distA = Math.pow((g.r + a.r) - playerPos.r, 2) + Math.pow((g.c + a.c) - playerPos.c, 2);
                    let distB = Math.pow((g.r + b.r) - playerPos.r, 2) + Math.pow((g.c + b.c) - playerPos.c, 2);
                    return distA - distB;
                });

                let chosenMove = null;
                for (let move of validMoves) {
                    let targetR = g.r + move.r;
                    let targetC = g.c + move.c;
                    let posKey = `${targetR},${targetC}`;
                    if (!occupiedPositions.has(posKey)) {
                        chosenMove = move;
                        break;
                    }
                }

                if (!chosenMove) {
                    chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                }

                g.r += chosenMove.r;
                g.c += chosenMove.c;
            }

            occupiedPositions.add(`${g.r},${g.c}`);
        });

        checkCollision();
        renderPacmanBoard(cases[currentCaseIndex]);
    }, 320);
}

function checkCollision() {
    let hit = ghosts.some(g => g.r === playerPos.r && g.c === playerPos.c);
    if (hit) {
        let eatenCoords = [];
        for (let r = 0; r < pacMap.length; r++) {
            for (let c = 0; c < pacMap[r].length; c++) {
                if (pacMap[r][c] === 3) eatenCoords.push({r, c});
            }
        }

        eatenCoords.sort(() => Math.random() - 0.5);
        let restoreCount = Math.floor(eatenCoords.length / 2);
        for (let i = 0; i < restoreCount; i++) {
            pacMap[eatenCoords[i].r][eatenCoords[i].c] = 0;
            dotsEaten--;
        }

        playerPos = { r: 1, c: 1 };
        let msgEl = document.getElementById("pac-msg");
        if (msgEl) msgEl.textContent = `⚡ ¡Te atraparon! Se restableció el 50% de tus puntos (${restoreCount} devueltos).`;
    }
}

function renderPacmanBoard(currentCase) {
    let html = `<div class="game-layout"><div class="info-panel"><div><h2>${currentCase.title}</h2><p class="story">${currentCase.story}</p><p style="color: #fbbf24; font-weight: bold;">Puntos: <span id="dotsCounter">${dotsEaten}</span> / ${totalDots}</p><div id="pac-msg" class="feedback" style="color: var(--accent-color);"></div></div><button class="skip-btn" onclick="skipCurrentLevel()">skip</button></div><div class="workspace-panel"><div class="pacman-board">`;
    
    for (let r = 0; r < pacMap.length; r++) {
        for (let c = 0; c < pacMap[r].length; c++) {
            let typeClass = "";
            let inner = "";
            if (pacMap[r][c] === 1) typeClass = "pac-wall";
            else if (pacMap[r][c] === 0) typeClass = "pac-dot";
            else if (pacMap[r][c] === 4) inner += `<div class="pac-power-img"></div>`;

            if (ghosts.some(g => g.r === r && g.c === c)) inner += `<div class="pac-ghost-img"></div>`;
            if (playerPos.r === r && playerPos.c === c) inner += `<div class="pac-player-img"></div>`;

            html += `<div class="pac-cell ${typeClass}">${inner}</div>`;
        }
    }
    html += `</div></div></div>`;
    
    let pacmanIndex = cases.findIndex(c => c.type === "pacman");
    if (currentCaseIndex === pacmanIndex && pacmanGameStarted) {
        let existingMsg = document.getElementById("pac-msg") ? document.getElementById("pac-msg").textContent : "";
        gameContainer.innerHTML = html;
        let msgEl = document.getElementById("pac-msg");
        if (existingMsg && msgEl) msgEl.textContent = existingMsg;
    }
}

function handlePacMove(e) {
    let pacmanIndex = cases.findIndex(c => c.type === "pacman");
    if (isModalOpen || currentCaseIndex !== pacmanIndex || !pacmanGameStarted) return;
    let dr = 0, dc = 0;
    if (e.key === "ArrowUp") dr = -1;
    else if (e.key === "ArrowDown") dr = 1;
    else if (e.key === "ArrowLeft") dc = -1;
    else if (e.key === "ArrowRight") dc = 1;
    else return;

    e.preventDefault();
    let newR = playerPos.r + dr;
    let newC = playerPos.c + dc;

    if (pacMap[newR] && pacMap[newR][newC] !== undefined) {
        if (pacMap[newR][newC] === 1) return;
        playerPos = { r: newR, c: newC };

        if (pacMap[newR][newC] === 0) {
            pacMap[newR][newC] = 3; 
            dotsEaten++;
        } else if (pacMap[newR][newC] === 4) {
            pacMap[newR][newC] = 3;
            dotsEaten++;

            let availableDots = [];
            for (let r = 0; r < pacMap.length; r++) {
                for (let c = 0; c < pacMap[r].length; c++) {
                    if (pacMap[r][c] === 0) availableDots.push({r, c});
                }
            }
            availableDots.sort(() => Math.random() - 0.5);
            let bonusCount = Math.ceil(totalDots * 0.10);
            let removedActual = 0;
            for (let i = 0; i < Math.min(bonusCount, availableDots.length); i++) {
                pacMap[availableDots[i].r][availableDots[i].c] = 3;
                dotsEaten++;
                removedActual++;
            }

            let msgEl = document.getElementById("pac-msg");
            if (msgEl) msgEl.textContent = `⚡ ¡Poder activado! Se eliminaron ${removedActual} puntos extra del mapa.`;
        }

        if (dotsEaten >= totalDots) {
            stopGhostInterval();
            showModal("⚡ LABERINTO SUPERADO", cases[currentCaseIndex].reward, "proceed");
            return;
        }

        checkCollision();
        renderPacmanBoard(cases[currentCaseIndex]);
    }
}

// --- SOPA DE LETRAS ---
const targetWords = ["CHAI", "PERRO", "CUMPLE", "POYO", "VAYASE", "CEBOLLIN", "GHAGHO", "GAMIN", "ECHAR", "ALO", "DORIAN", "TREINTA"];
let foundWordsCount = 0;
let activeSelection = [];

function loadWordSearchGame(currentCase) {
    foundWordsCount = 0; 
    activeSelection = [];
    const grid = [
        ['A','L','O','B','X','Y','Z','W','Q','R','N','T'],
        ['C','O','F','G','H','A','G','H','O','A','O','Y'],
        ['E','B','P','E','R','R','O','X','I','Z','W','Q'],
        ['L','C','R','I','A','N','R','R','T','U','V','W'],
        ['P','E','A','Y','A','S','O','X','Y','Z','A','Q'],
        ['M','B','Y','Z','W','D','R','S','T','A','Y','W'],
        ['U','O','F','A','C','U','M','P','L','T','A','Z'],
        ['C','L','Y','R','W','Q','R','S','T','N','S','W'],
        ['X','L','G','A','M','I','N','X','Y','I','E','O'],
        ['X','I','Z','H','Q','R','S','T','U','E','W','Y'],
        ['X','N','E','C','H','A','I','X','Y','R','W','O'],
        ['X','Y','Z','E','Q','R','S','T','C','T','N','P']
    ];

    let html = `<div class="game-layout"><div class="info-panel"><div><h2>${currentCase.title}</h2><p class="story">${currentCase.story}</p><p>Formando: <span id="wsSelectedDisplay" style="color: var(--accent-color); font-weight: bold;">-</span></p></div><button class="skip-btn" onclick="skipCurrentLevel()">skip</button></div><div class="workspace-panel"><div class="game-layout" style="gap:15px;"><div class="word-search-grid">`;
    for (let r = 0; r < 12; r++) {
        for (let c = 0; c < 12; c++) {
            html += `<div class="ws-cell" id="c-${r}-${c}" onclick="clickWsCell(this, ${r}, ${c}, '${grid[r][c]}')">${grid[r][c]}</div>`;
        }
    }
    html += `</div><div class="words-list"><h4>Objetivo (0/12)</h4><ul>`;
    targetWords.forEach((w, i) => html += `<li class="word-item" id="wl-${i}">${w}</li>`);
    html += `</ul></div></div></div></div>`;
    gameContainer.innerHTML = html;
}

function clickWsCell(el, r, c, letter) {
    if (isModalOpen) return;
    if (el.classList.contains("active-click")) {
        el.classList.remove("active-click");
        activeSelection = activeSelection.filter(item => item.id !== `c-${r}-${c}`);
    } else {
        el.classList.add("active-click");
        activeSelection.push({ id: `c-${r}-${c}`, letter: letter, el: el });
    }

    let word = activeSelection.map(i => i.letter).join("");
    let displayEl = document.getElementById("wsSelectedDisplay");
    if (displayEl) displayEl.textContent = word || "-";

    let idx = targetWords.indexOf(word);
    if (idx !== -1) {
        let listItem = document.getElementById(`wl-${idx}`);
        if (listItem && !listItem.classList.contains("found-word")) {
            listItem.classList.add("found-word");
            foundWordsCount++;
            activeSelection.forEach(item => {
                item.el.classList.remove("active-click");
                item.el.classList.add("permanently-found");
            });
            activeSelection = [];
            if (displayEl) displayEl.textContent = "-";
            let listTitle = document.querySelector(".words-list h4");
            if (listTitle) listTitle.textContent = `Objetivo (${foundWordsCount}/12)`;
            
            if (foundWordsCount === 12) {
                showModal("⚡ ACCESO CONCEDIDO", cases[currentCaseIndex].reward, "proceed");
            }
        }
    }
}

// --- ROMPECABEZAS ---
let pState = [5, 2, 0, 3, 1, 15, 6, 7, 8, 4, 10, 11, 9, 13, 12, 14]; 
function loadPuzzleGame(currentCase) {
    pState = [5, 2, 0, 3, 1, 15, 6, 7, 8, 4, 10, 11, 9, 13, 12, 14];
    renderP(currentCase);
}

function renderP(c) {
    let html = `<div class="game-layout"><div class="info-panel"><div><h2>${c.title}</h2><p class="story">${c.story}</p></div><button class="skip-btn" onclick="skipCurrentLevel()">skip</button></div><div class="workspace-panel"><div class="puzzle-board">`;
    pState.forEach((v, i) => {
        if (v === 15) {
            html += `<div class="puzzle-tile empty"></div>`;
        } else {
            let x = (v % 4) * 90, y = Math.floor(v / 4) * 90;
            html += `<div class="puzzle-tile" style="background-position: -${x}px -${y}px" onclick="moveP(${i})"></div>`;
        }
    });
    gameContainer.innerHTML = html + `</div></div></div>`;
}

function moveP(i) {
    if (isModalOpen) return;
    let empty = pState.indexOf(15), r = Math.floor(i/4), c = i%4, er = Math.floor(empty/4), ec = empty%4;
    if (Math.abs(r-er) + Math.abs(c-ec) === 1) {
        pState[empty] = pState[i]; 
        pState[i] = 15; 
        renderP(cases[currentCaseIndex]);
        if (pState.every((v, idx) => v === idx)) {
            showModal(
                "PROTOCOLO OMEGA: MISIÓN CUMPLIDA", 
                "<strong>Informe:</strong> ¡Excelente trabajo, Agente Juan! Has descifrado los cortafuegos y asegurado el expediente a tiempo. La brecha digital ha sido neutralizada.<br><br><strong>Transmisión entrante:</strong> Un momento... la Agencia ha interceptado un archivo multimedia cifrado de última hora. Alguien quiere darte un mensaje personal por lograrlo.", 
                "final"
            );
        }
    }
}

loadCase();