const chalk = require("chalk");
const { question, keyIn } = require("readline-sync");

const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");
const ConfigManager = require("../../classes/ConfigManager");

/**
 * The classic Snake game in BubbleOS!
 *
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const snake = (...args) => {
  try {
    // Game constants
    const BOARD_WIDTH = 20;
    const BOARD_HEIGHT = 10;
    const INITIAL_SNAKE = [[2, 2]];
    const INITIAL_DIRECTION = "right";

    // Game state
    let snake = [...INITIAL_SNAKE];
    let direction = INITIAL_DIRECTION;
    let food = null;
    let gameOver = false;
    let score = 0;

    // Generate new food position
    const generateFood = () => {
      let x, y;
      do {
        x = Math.floor(Math.random() * BOARD_WIDTH);
        y = Math.floor(Math.random() * BOARD_HEIGHT);
      } while (snake.some(([sx, sy]) => sx === x && sy === y));
      food = [x, y];
    };

    // Draw the game board
    const draw = () => {
      // DO NOT use process.stdout.write("\x1bc") since
      // that just lags the rendering
      console.clear();
      const board = Array(BOARD_HEIGHT)
        .fill()
        .map(() => Array(BOARD_WIDTH).fill(" "));

      // Draw snake
      snake.forEach(([x, y], i) => {
        if (x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT) {
          board[y][x] = i === 0 ? chalk.green("◉") : chalk.green("○");
        }
      });

      // Draw food
      if (food) {
        board[food[1]][food[0]] = chalk.red("●");
      }

      // Draw border and board with adjusted spacing
      console.log("╔" + "═".repeat(BOARD_WIDTH * 2 + 1) + "╗");
      board.forEach((row) => {
        console.log("║ " + row.join(" ") + " ║");
      });
      console.log("╚" + "═".repeat(BOARD_WIDTH * 2 + 1) + "╝");
      console.log(chalk.yellow(`Score: ${score}`));
    };

    // Update game state
    const update = (key) => {
      if (gameOver) return;

      const originalDirection = direction;

      // Update direction based on key
      switch (key) {
        case "w":
          if (direction !== "down") direction = "up";
          break;
        case "s":
          if (direction !== "up") direction = "down";
          break;
        case "a":
          if (direction !== "right") direction = "left";
          break;
        case "d":
          if (direction !== "left") direction = "right";
          break;
      }

      const keyToDir = { w: "up", s: "down", a: "left", d: "right" };
      const oppositeDir = { up: "down", down: "up", left: "right", right: "left" };

      if (key in keyToDir && keyToDir[key] === oppositeDir[originalDirection]) {
        // Key is opposite to the original direction - prevent movement
        return false; // Exit update early, no movement occurs
      }

      const head = snake[0];
      let newHead;
      switch (direction) {
        case "up":
          newHead = [head[0], head[1] - 1];
          break;
        case "down":
          newHead = [head[0], head[1] + 1];
          break;
        case "left":
          newHead = [head[0] - 1, head[1]];
          break;
        case "right":
          newHead = [head[0] + 1, head[1]];
          break;
      }

      // Check collision with walls
      if (
        newHead[0] < 0 ||
        newHead[0] >= BOARD_WIDTH ||
        newHead[1] < 0 ||
        newHead[1] >= BOARD_HEIGHT
      ) {
        return true; // Game over
      }

      // Check collision with self
      if (snake.some(([x, y]) => x === newHead[0] && y === newHead[1])) {
        return true; // Game over
      }

      // Move snake
      snake.unshift(newHead);

      // Check if food is eaten
      if (food && newHead[0] === food[0] && newHead[1] === food[1]) {
        score += 10;
        generateFood();
      } else {
        snake.pop();
      }

      return false; // Game continues
    };

    // Instructions
    process.stdout.write("\x1bc");
    console.log(chalk.bold.underline.cyan("Snake Game Instructions\n"));
    console.log("- Use WASD keys to control the snake:");
    console.log("  W = Up");
    console.log("  S = Down");
    console.log("  A = Left");
    console.log("  D = Right");
    console.log(`- Eat the apples ${chalk.red("●")} to grow and gain points`);
    console.log("- Avoid hitting walls and yourself");
    console.log("- Press 'q' to quit\n");

    question(chalk.yellow("Press Enter to start . . . "), { hideEchoBack: true, mask: "" });

    // Start game
    generateFood();
    draw();

    // Game loop
    while (!gameOver) {
      const key = keyIn("", {
        hideEchoBack: true,
        mask: "",
        limit: "wasdq",
      });

      gameOver = update(key);
      draw();

      if (gameOver || key === "q") {
        const config = new ConfigManager();
        const highScore = config.getConfig()?.snakeHighScore ?? -1;
        process.stdout.write("\x1bc");

        console.log(chalk.red.bold.underline("GAME OVER"));
        console.log(chalk.white.bold(`Score: ${score}\n`));

        if (highScore < score) {
          console.log(chalk.green.bold(`NEW HIGH SCORE: ${score}!`));
          config.addData({ snakeHighScore: score });
        } else console.log(chalk.yellow.bold(`High Score: ${highScore}`));

        console.log();
        break;
      }
    }
  } catch (err) {
    _nonFatalError(err);
  }
};

module.exports = snake;
