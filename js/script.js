// Configurações do jogo
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;  // Tamanho de cada quadrado
const canvasSize = 20; // Grade 20x20
canvas.width = box * canvasSize;
canvas.height = box * canvasSize;

let snake = [{ x: 10 * box, y: 10 * box }];
let direction = "RIGHT";
let food = generateFood();
let gameSpeed = 150; // Velocidade inicial do jogo
let score = 0;
let highScore = localStorage.getItem("highScore") || 0; 

document.getElementById("highScore").innerText = highScore;

// Sons
const eatSound = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
const gameOverSound = new Audio("https://www.fesliyanstudios.com/play-mp3/522");

// Perguntar o nome do jogador
let playerName = prompt("Digite seu nome:");
if (!playerName) playerName = "Jogador";
document.getElementById("playerName").innerText = playerName;

// Captura os eventos de tecla
document.addEventListener("keydown", changeDirection);
document.getElementById("restartButton").addEventListener("click", restartGame);

function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== "RIGHT") direction = "LEFT";
    if (key === 38 && direction !== "DOWN") direction = "UP";
    if (key === 39 && direction !== "LEFT") direction = "RIGHT";
    if (key === 40 && direction !== "UP") direction = "DOWN";
}

// Função para gerar comida em posição aleatória
function generateFood() {
    return {
        x: Math.floor(Math.random() * canvasSize) * box,
        y: Math.floor(Math.random() * canvasSize) * box
    };
}

// Função para desenhar a cobrinha
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "lime" : "green";
        ctx.fillRect(segment.x, segment.y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(segment.x, segment.y, box, box);
    });
}

// Função de Game Over
function gameOver() {
    gameOverSound.play();
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    alert(`Game Over, ${playerName}! Sua pontuação: ${score}`);
    
    document.getElementById("restartButton").style.display = "block";
}

// Função principal do jogo
function gameLoop() {
    let head = { ...snake[0] };
    
    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;

    // Verifica colisões com a parede ou o próprio corpo
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Verifica se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").innerText = score;
        food = generateFood();
        eatSound.play();
        // Aumenta a velocidade a cada 5 pontos
        if (score % 5 === 0 && gameSpeed > 50) {
            gameSpeed -= 10;
        }
    } else {
        snake.pop();
    }

    // Redesenha a tela
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();

    // comida da cobra
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    setTimeout(gameLoop, gameSpeed);
}

// Função para reiniciar o jogo sem recarregar a página
function restartGame() {
    score = 0;
    gameSpeed = 150;
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    food = generateFood();
    document.getElementById("score").innerText = score;
    document.getElementById("restartButton").style.display = "none";
    gameLoop();
}

// Inicia o jogo
gameLoop();
