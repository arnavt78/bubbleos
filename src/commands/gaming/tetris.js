const chalk = require("chalk");
const { question } = require("readline-sync");

/**
 * All shapes for Tetris, like in the original game.
 */
const SHAPES = [
  {
    color: "red",
    blocks: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    name: "I",
  },
  {
    color: "blue",
    blocks: [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
    name: "Z",
  },
  {
    color: "green",
    blocks: [
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
    ],
    name: "S",
  },
  {
    color: "yellow",
    blocks: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
    name: "O",
  },
  {
    color: "magenta",
    blocks: [
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 0],
    ],
    name: "L",
  },
  {
    color: "cyan",
    blocks: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
    ],
    name: "J",
  },
  {
    color: "white",
    blocks: [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    name: "T",
  },
];

/**
 * Tetris in BubbleOS!
 *
 * @param {...string} args Arguments that can be used to modify the behavior of this command.
 */
const tetris = async (...args) => {
  // Game constants
  const WIDTH = 10;
  const HEIGHT = 16;

  // Game state
  let score = 0;
  let board = Array(HEIGHT)
    .fill()
    .map(() => Array(WIDTH).fill(0));
  let currentPiece = null;
  let currentPos = { x: 0, y: 0 };
  let nextPiece = null;
  let gameOver = false;

  const createPiece = () =>
    JSON.parse(JSON.stringify(SHAPES[Math.floor(Math.random() * SHAPES.length)]));

  const drawBoard = () => {
    console.clear();
    let display = "╔" + "═".repeat(WIDTH) + "╗    Score: " + chalk.bold(score) + "\n";

    for (let y = 0; y < HEIGHT; y++) {
      display += "║";
      for (let x = 0; x < WIDTH; x++) {
        let cell = board[y][x];
        if (
          currentPiece &&
          currentPiece.blocks.some(([by, bx]) => by + currentPos.y === y && bx + currentPos.x === x)
        ) {
          display += chalk[currentPiece.color]("█");
        } else if (cell && cell.color) {
          display += chalk[cell.color]("█");
        } else {
          display += " ";
        }
      }
      display += "║";

      if (y === 0) {
        display += "    Next block:";
      } else if (y >= 1 && y <= 4 && nextPiece) {
        display += "    ";
        for (let x = 0; x < 4; x++) {
          if (nextPiece.blocks.some(([by, bx]) => by === y - 1 && bx === x)) {
            display += chalk[nextPiece.color]("█");
          } else {
            display += " ";
          }
        }
      }
      display += "\n";
    }

    display += "╚" + "═".repeat(WIDTH) + "╝\n";
    console.log(display);
  };

  const canMove = (piece, newPos) =>
    piece.blocks.every(([y, x]) => {
      let newY = y + newPos.y;
      let newX = x + newPos.x;
      return newY >= 0 && newY < HEIGHT && newX >= 0 && newX < WIDTH && !board[newY][newX]?.color;
    });

  const rotate = (piece) => {
    let newBlocks = piece.blocks.map(([y, x]) => [-x, y]);
    let minY = Math.min(...newBlocks.map(([y]) => y));
    let minX = Math.min(...newBlocks.map(([_, x]) => x));
    return {
      ...piece,
      blocks: newBlocks.map(([y, x]) => [y - minY, x - minX]),
    };
  };

  const mergePiece = () => {
    currentPiece.blocks.forEach(([y, x]) => {
      if (y + currentPos.y >= 0) {
        board[y + currentPos.y][x + currentPos.x] = {
          color: currentPiece.color,
        };
      }
    });
  };

  const checkLines = () => {
    let linesCleared = 0;
    for (let y = HEIGHT - 1; y >= 0; y--) {
      if (board[y].every((cell) => cell?.color)) {
        board.splice(y, 1);
        board.unshift(Array(WIDTH).fill(0));
        linesCleared++;
        y++;
      }
    }
    if (linesCleared > 0) {
      score += [40, 100, 300, 1200][linesCleared - 1];
    }
  };

  const cleanup = () => {
    stdin.removeAllListeners("data");
    stdin.setRawMode(false);
    stdin.pause();
    stdin.setEncoding("utf8");

    process.stdout.write("\x1bc");
    console.log(chalk.bold.red(`Game over! Final score: ${chalk.bold(score)}\n`));
  };

  process.stdout.write("\x1bc");
  console.log(chalk.bold.underline.cyan("Tetris Instructions\n"));
  console.log("- Use WASD keys to control the block falling:");
  console.log("  W = Rotate");
  console.log("  S = Soft Drop");
  console.log("  A = Move Left");
  console.log("  D = Move Right");
  console.log("- Put the blocks together so that lines are cleared");
  console.log("- Clearing more lines at the same time gives more points");
  console.log("- Avoid letting the blocks reach the top");
  console.log("- Press 'q' to quit\n");

  question(chalk.yellow("Press Enter to start . . . "), { hideEchoBack: true, mask: "" });
  process.stdout.write("\x1bc");

  currentPiece = createPiece();
  nextPiece = createPiece();
  currentPos = { x: Math.floor(WIDTH / 2) - 1, y: 0 };

  const stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");

  stdin.on("data", (key) => {
    const keyCode = key.charCodeAt(0);
    if (key === "q") {
      gameOver = true;
      cleanup();
      return;
    }

    if (!gameOver) {
      if (
        (key === "a" || keyCode === 37) &&
        canMove(currentPiece, { ...currentPos, x: currentPos.x - 1 })
      ) {
        currentPos.x--;
      }
      if (
        (key === "d" || keyCode === 39) &&
        canMove(currentPiece, { ...currentPos, x: currentPos.x + 1 })
      ) {
        currentPos.x++;
      }
      if (key === "w" || keyCode === 38) {
        let rotated = rotate(currentPiece);
        if (canMove(rotated, currentPos)) {
          currentPiece = rotated;
        }
      }
      if (key === "s" || keyCode === 40) {
        if (canMove(currentPiece, { ...currentPos, y: currentPos.y + 1 })) {
          currentPos.y++;
        }
      }
      drawBoard();
    }
  });

  while (!gameOver) {
    if (canMove(currentPiece, { ...currentPos, y: currentPos.y + 1 })) {
      currentPos.y++;
    } else {
      mergePiece();
      checkLines();
      currentPiece = nextPiece;
      nextPiece = createPiece();
      currentPos = { x: Math.floor(WIDTH / 2) - 1, y: 0 };

      if (!canMove(currentPiece, currentPos)) {
        gameOver = true;
        cleanup();
        break;
      }
    }

    drawBoard();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

module.exports = tetris;
