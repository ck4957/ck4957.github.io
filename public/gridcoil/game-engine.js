export const GRID_COLUMNS = 16;
export const GRID_ROWS = 24;
export const INITIAL_LENGTH = 4;

export const DIRECTIONS = Object.freeze({
  up: Object.freeze({ name: "up", x: 0, y: -1, opposite: "down" }),
  down: Object.freeze({ name: "down", x: 0, y: 1, opposite: "up" }),
  left: Object.freeze({ name: "left", x: -1, y: 0, opposite: "right" }),
  right: Object.freeze({ name: "right", x: 1, y: 0, opposite: "left" }),
});

const pointEquals = (left, right) => left.x === right.x && left.y === right.y;

export class GridcoilGame {
  constructor(random = Math.random) {
    this.random = random;
    this.reset();
  }

  reset() {
    this.snake = [
      { x: 8, y: 12 },
      { x: 7, y: 12 },
      { x: 6, y: 12 },
      { x: 5, y: 12 },
    ];
    this.food = { x: 12, y: 7 };
    this.direction = DIRECTIONS.right;
    this.directionQueue = [];
    this.phase = "ready";
    this.score = 0;
  }

  get level() {
    return Math.min(10, 1 + Math.floor(this.score / 6));
  }

  get tickInterval() {
    return Math.max(75, 290 - (this.level - 1) * 12);
  }

  start(initialDirection = null) {
    if (this.phase !== "ready" && this.phase !== "paused") {
      return false;
    }

    if (this.phase === "ready" && initialDirection) {
      this.orientSnake(initialDirection);
    }

    this.phase = "playing";
    return true;
  }

  pause() {
    if (this.phase !== "playing") {
      return false;
    }

    this.phase = "paused";
    return true;
  }

  turn(nextDirection) {
    const directionToFollow =
      this.directionQueue[this.directionQueue.length - 1] ?? this.direction;

    if (
      !nextDirection ||
      nextDirection.name === directionToFollow.name ||
      nextDirection.name === directionToFollow.opposite ||
      this.directionQueue.length >= 2
    ) {
      return false;
    }

    this.directionQueue.push(nextDirection);
    return true;
  }

  step() {
    if (this.phase !== "playing") {
      return "idle";
    }

    if (this.directionQueue.length > 0) {
      this.direction = this.directionQueue.shift();
    }

    const head = this.snake[0];
    const nextHead = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y,
    };
    const willEat = pointEquals(nextHead, this.food);
    const occupiedBody = willEat ? this.snake : this.snake.slice(0, -1);

    if (
      nextHead.x < 0 ||
      nextHead.x >= GRID_COLUMNS ||
      nextHead.y < 0 ||
      nextHead.y >= GRID_ROWS ||
      occupiedBody.some((point) => pointEquals(point, nextHead))
    ) {
      this.phase = "game-over";
      return "game-over";
    }

    this.snake.unshift(nextHead);

    if (willEat) {
      this.score += 1;
      if (!this.placeFood()) {
        this.phase = "won";
        return "won";
      }
      return "ate-food";
    }

    this.snake.pop();
    return "moved";
  }

  orientSnake(initialDirection) {
    const head = {
      x: Math.floor(GRID_COLUMNS / 2),
      y: Math.floor(GRID_ROWS / 2),
    };
    const tailDirection = DIRECTIONS[initialDirection.opposite];

    this.snake = Array.from({ length: INITIAL_LENGTH }, (_, offset) => ({
      x: head.x + tailDirection.x * offset,
      y: head.y + tailDirection.y * offset,
    }));
    this.direction = initialDirection;
    this.directionQueue = [];
  }

  placeFood() {
    const occupied = new Set(this.snake.map((point) => `${point.x},${point.y}`));
    const freeCells = [];

    for (let y = 0; y < GRID_ROWS; y += 1) {
      for (let x = 0; x < GRID_COLUMNS; x += 1) {
        if (!occupied.has(`${x},${y}`)) {
          freeCells.push({ x, y });
        }
      }
    }

    if (freeCells.length === 0) {
      return false;
    }

    const randomIndex = Math.min(
      freeCells.length - 1,
      Math.floor(this.random() * freeCells.length),
    );
    this.food = freeCells[randomIndex];
    return true;
  }
}
