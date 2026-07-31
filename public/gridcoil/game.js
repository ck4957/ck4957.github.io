import {
  DIRECTIONS,
  GRID_COLUMNS,
  GRID_ROWS,
  GridcoilGame,
} from "./game-engine.js";

const BEST_SCORE_KEY = "gridcoil.browser.best-score";
const keyDirections = {
  ArrowUp: DIRECTIONS.up,
  w: DIRECTIONS.up,
  W: DIRECTIONS.up,
  ArrowDown: DIRECTIONS.down,
  s: DIRECTIONS.down,
  S: DIRECTIONS.down,
  ArrowLeft: DIRECTIONS.left,
  a: DIRECTIONS.left,
  A: DIRECTIONS.left,
  ArrowRight: DIRECTIONS.right,
  d: DIRECTIONS.right,
  D: DIRECTIONS.right,
};

const game = new GridcoilGame();
const canvas = document.querySelector("#gameCanvas");
const context = canvas.getContext("2d");
const gameRoot = document.querySelector("#game");
const board = document.querySelector(".board");
const scoreElements = document.querySelectorAll("[data-score]");
const bestElements = document.querySelectorAll("[data-best]");
const statusTitle = document.querySelector("#statusTitle");
const statusDetail = document.querySelector("#statusDetail");
const statusPanel = document.querySelector("#statusPanel");
const overlayButton = document.querySelector("#overlayButton");
const playButtons = document.querySelectorAll("[data-action='play']");
const restartButtons = document.querySelectorAll("[data-action='restart']");
const directionButtons = document.querySelectorAll("[data-direction]");
const liveStatus = document.querySelector("#liveStatus");

let bestScore = readBestScore();
let ticker = null;
let pointerStart = null;

function readBestScore() {
  try {
    const storedScore = Number.parseInt(localStorage.getItem(BEST_SCORE_KEY), 10);
    return Number.isFinite(storedScore) && storedScore > 0 ? storedScore : 0;
  } catch {
    return 0;
  }
}

function saveBestScore() {
  if (game.score <= bestScore) {
    return;
  }

  bestScore = game.score;
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
  } catch {
    // Gameplay remains fully functional when browser storage is unavailable.
  }
}

function scheduleTick() {
  stopTicker();
  if (game.phase !== "playing") {
    return;
  }

  ticker = window.setTimeout(() => {
    const result = game.step();
    saveBestScore();
    render();

    if (result === "game-over") {
      announce(`Round over. Score ${game.score}.`);
      return;
    }

    if (result === "won") {
      announce(`Board cleared. Final score ${game.score}.`);
      return;
    }

    scheduleTick();
  }, game.tickInterval);
}

function stopTicker() {
  if (ticker !== null) {
    window.clearTimeout(ticker);
    ticker = null;
  }
}

function start(initialDirection = null) {
  if (game.phase === "game-over" || game.phase === "won") {
    game.reset();
  }

  if (game.start(initialDirection)) {
    announce("Round started.");
    scheduleTick();
  }
  render();
}

function togglePlayPause() {
  if (game.phase === "playing") {
    game.pause();
    stopTicker();
    announce("Game paused.");
  } else {
    start();
  }
  render();
}

function restart({ playImmediately = false } = {}) {
  stopTicker();
  game.reset();
  announce("Game reset.");
  if (playImmediately) {
    game.start();
    scheduleTick();
  }
  render();
}

function handleDirection(direction) {
  if (game.phase === "ready" || game.phase === "game-over" || game.phase === "won") {
    if (game.phase !== "ready") {
      game.reset();
    }
    game.start(direction);
    announce("Round started.");
    scheduleTick();
  } else if (game.phase === "paused") {
    game.turn(direction);
    game.start();
    announce("Round resumed.");
    scheduleTick();
  } else if (game.turn(direction)) {
    announce(`Turned ${direction.name}.`);
  }
  render();
}

function announce(message) {
  liveStatus.textContent = message;
}

function render() {
  scoreElements.forEach((element) => {
    element.textContent = String(game.score);
  });
  bestElements.forEach((element) => {
    element.textContent = String(bestScore);
  });

  const isPlaying = game.phase === "playing";
  playButtons.forEach((button) => {
    const label =
      game.phase === "playing"
        ? "Pause"
        : game.phase === "paused"
          ? "Resume"
          : game.phase === "ready"
            ? "Play"
            : "Play again";
    button.querySelector("[data-action-label]").textContent = label;
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-pressed", String(isPlaying));
  });

  const statusCopy = {
    ready: ["Ready", "Use arrow keys or WASD to start"],
    paused: ["Paused", "Press Space or choose Resume"],
    "game-over": ["Round over", `Score ${game.score} · Play again`],
    won: ["Board cleared", `Final score ${game.score} · Play again`],
  };
  const visibleStatus = statusCopy[game.phase];
  statusPanel.hidden = !visibleStatus;

  if (visibleStatus) {
    statusTitle.textContent = visibleStatus[0];
    statusDetail.textContent = visibleStatus[1];
    overlayButton.hidden = game.phase === "ready";
    overlayButton.textContent =
      game.phase === "paused" ? "Resume" : "Play again";
  }

  gameRoot.dataset.phase = game.phase;
  gameRoot.dataset.head = `${game.snake[0].x},${game.snake[0].y}`;
  canvas.setAttribute(
    "aria-label",
    `Gridcoil board. ${game.phase.replace("-", " ")}. Score ${game.score}. Best ${bestScore}.`,
  );
  drawBoard();
}

function resizeCanvas() {
  const rectangle = canvas.getBoundingClientRect();
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rectangle.width * pixelRatio));
  const height = Math.max(1, Math.round(rectangle.height * pixelRatio));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  drawBoard();
}

function drawBoard() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width === 0 || height === 0) {
    return;
  }

  const cellWidth = width / GRID_COLUMNS;
  const cellHeight = height / GRID_ROWS;
  context.clearRect(0, 0, width, height);

  context.fillStyle = "rgba(51, 66, 38, 0.12)";
  for (let y = 0; y < GRID_ROWS; y += 1) {
    for (let x = 0; x < GRID_COLUMNS; x += 1) {
      context.beginPath();
      context.arc(
        (x + 0.5) * cellWidth,
        (y + 0.5) * cellHeight,
        Math.max(0.7, Math.min(cellWidth, cellHeight) * 0.035),
        0,
        Math.PI * 2,
      );
      context.fill();
    }
  }

  drawFood(game.food, cellWidth, cellHeight);
  [...game.snake].reverse().forEach((point, reverseIndex) => {
    const index = game.snake.length - reverseIndex - 1;
    drawSnakeSegment(point, index, cellWidth, cellHeight);
  });
}

function drawFood(point, cellWidth, cellHeight) {
  const inset = Math.min(cellWidth, cellHeight) * 0.19;
  context.save();
  context.shadowColor = "rgba(255, 104, 78, 0.5)";
  context.shadowBlur = Math.min(cellWidth, cellHeight) * 0.36;
  context.fillStyle = "#ff684e";
  roundedRect(
    point.x * cellWidth + inset,
    point.y * cellHeight + inset,
    cellWidth - inset * 2,
    cellHeight - inset * 2,
    Math.min(cellWidth, cellHeight) * 0.18,
  );
  context.fill();
  context.restore();
}

function drawSnakeSegment(point, index, cellWidth, cellHeight) {
  const inset = Math.min(cellWidth, cellHeight) * 0.11;
  const x = point.x * cellWidth + inset;
  const y = point.y * cellHeight + inset;
  const width = cellWidth - inset * 2;
  const height = cellHeight - inset * 2;
  const gradient = context.createLinearGradient(x, y, x, y + height);
  gradient.addColorStop(0, index === 0 ? "#23b8b2" : "#19aaa7");
  gradient.addColorStop(1, index === 0 ? "#07817f" : "#087c7c");

  context.save();
  context.shadowColor = "rgba(8, 119, 119, 0.28)";
  context.shadowBlur = Math.min(cellWidth, cellHeight) * 0.22;
  context.shadowOffsetY = 1;
  context.fillStyle = gradient;
  roundedRect(x, y, width, height, Math.min(cellWidth, cellHeight) * 0.2);
  context.fill();
  context.restore();

  if (index === 0) {
    drawEyes(point, cellWidth, cellHeight);
  }
}

function drawEyes(point, cellWidth, cellHeight) {
  const centerX = (point.x + 0.5) * cellWidth;
  const centerY = (point.y + 0.5) * cellHeight;
  const forward = game.direction;
  const perpendicular = { x: -forward.y, y: forward.x };
  const forwardOffset = Math.min(cellWidth, cellHeight) * 0.18;
  const sideOffset = Math.min(cellWidth, cellHeight) * 0.14;
  const eyeRadius = Math.max(1.1, Math.min(cellWidth, cellHeight) * 0.055);

  context.fillStyle = "#083f3e";
  [-1, 1].forEach((side) => {
    context.beginPath();
    context.arc(
      centerX + forward.x * forwardOffset + perpendicular.x * sideOffset * side,
      centerY + forward.y * forwardOffset + perpendicular.y * sideOffset * side,
      eyeRadius,
      0,
      Math.PI * 2,
    );
    context.fill();
  });
}

function roundedRect(x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.roundRect(x, y, width, height, safeRadius);
}

function handleKeydown(event) {
  const direction = keyDirections[event.key];
  if (direction) {
    event.preventDefault();
    handleDirection(direction);
    return;
  }

  if (event.code === "Space" || event.key === "p" || event.key === "P") {
    event.preventDefault();
    togglePlayPause();
  } else if (event.key === "r" || event.key === "R") {
    event.preventDefault();
    restart();
  }
}

function handlePointerDown(event) {
  pointerStart = { x: event.clientX, y: event.clientY };
}

function handlePointerUp(event) {
  if (!pointerStart) {
    return;
  }

  const deltaX = event.clientX - pointerStart.x;
  const deltaY = event.clientY - pointerStart.y;
  pointerStart = null;

  if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 24) {
    return;
  }

  handleDirection(
    Math.abs(deltaX) > Math.abs(deltaY)
      ? deltaX > 0
        ? DIRECTIONS.right
        : DIRECTIONS.left
      : deltaY > 0
        ? DIRECTIONS.down
        : DIRECTIONS.up,
  );
}

playButtons.forEach((button) => {
  button.addEventListener("click", () => {
    togglePlayPause();
    canvas.focus({ preventScroll: true });
  });
});
restartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    restart();
    canvas.focus({ preventScroll: true });
  });
});
directionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleDirection(DIRECTIONS[button.dataset.direction]);
    canvas.focus({ preventScroll: true });
  });
});
overlayButton.addEventListener("click", () => {
  if (game.phase === "paused") {
    start();
  } else {
    restart({ playImmediately: true });
  }
  canvas.focus({ preventScroll: true });
});

document.addEventListener("keydown", handleKeydown);
canvas.addEventListener("pointerdown", handlePointerDown);
canvas.addEventListener("pointerup", handlePointerUp);
canvas.addEventListener("pointercancel", () => {
  pointerStart = null;
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && game.pause()) {
    stopTicker();
    render();
  }
});

new ResizeObserver(resizeCanvas).observe(board);
render();
