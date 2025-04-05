const chalk = require("chalk");
const { question, keyIn } = require("readline-sync");

const _nonFatalError = require("../../functions/nonFatalError");

const Verbose = require("../../classes/Verbose");

const tictactoe = async (...args) => {
  try {
    const board = Array(9).fill(" ");
    const players = ["X", "O"];
    let currentPlayer;

    const displayBoard = (errorMessage) => {
      console.clear();
      for (let i = 0; i < 9; i += 3) {
        console.log(
          chalk.cyan(" ") +
            ` ${chalk.yellow(board[i] || " ")} │ ${chalk.yellow(
              board[i + 1] || " "
            )} │ ${chalk.yellow(board[i + 2] || " ")} `
        );
        if (i < 6) console.log(chalk.cyan(" ───┼───┼───"));
      }

      if (errorMessage) {
        console.log("\n" + errorMessage);
      }
    };

    const checkWin = () => {
      const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // Rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // Columns
        [0, 4, 8],
        [2, 4, 6], // Diagonals
      ];

      return winPatterns.some(
        (pattern) =>
          board[pattern[0]] !== " " &&
          board[pattern[0]] === board[pattern[1]] &&
          board[pattern[1]] === board[pattern[2]]
      );
    };

    const isBoardFull = () => !board.includes(" ");

    const getAvailableMoves = () =>
      board.reduce((moves, cell, index) => {
        if (cell === " ") moves.push(index);
        return moves;
      }, []);

    const minimax = (board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) => {
      if (checkWin()) return isMaximizing ? -10 : 10;
      if (isBoardFull()) return 0;

      const moves = getAvailableMoves();
      let bestScore = isMaximizing ? -Infinity : Infinity;

      for (let move of moves) {
        board[move] = isMaximizing ? "O" : "X";
        let score = minimax(board, depth + 1, !isMaximizing, alpha, beta);
        board[move] = " ";

        bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);

        if (isMaximizing) {
          alpha = Math.max(alpha, score);
        } else {
          beta = Math.min(beta, score);
        }

        if (beta <= alpha) break;
      }

      return bestScore;
    };

    const computerMove = (difficulty) => {
      const moves = getAvailableMoves();

      if (difficulty === "easy") {
        return moves[Math.floor(Math.random() * moves.length)];
      }

      if (difficulty === "medium") {
        return Math.random() < 0.5
          ? moves[Math.floor(Math.random() * moves.length)]
          : getBestMove();
      }

      return getBestMove();
    };

    const getBestMove = () => {
      let bestScore = -Infinity;
      let bestMove;
      const moves = getAvailableMoves();

      for (let move of moves) {
        board[move] = "O";
        let score = minimax(board, 0, false);
        board[move] = " ";

        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }

      return bestMove;
    };

    const startGame = () => {
      process.stdout.write("\x1bc");
      console.log(chalk.bold.underline.cyan("Tic-Tac-Toe Instructions\n"));
      console.log("- Play against the computer or another person");
      console.log("- Press the number relating to the box to place symbol in that position");
      console.log("- Avoid letting your opponent get three of their symbols in a row");

      console.log(`
  1 │ 2 │ 3
 ───┼───┼───
  4 │ 5 │ 6
 ───┼───┼───
  7 │ 8 │ 9
`);

      question(chalk.yellow("Press Enter to start . . . "), { hideEchoBack: true, mask: "" });
      process.stdout.write("\x1bc");

      const gameMode = keyIn(
        `${chalk.underline.bold("Select game mode:")}\n1. Singleplayer\n2. Multiplayer\n`,
        {
          limit: "12",
        }
      );

      if (gameMode === "1") {
        console.log();
        const difficulty = ["easy", "medium", "impossible"][
          keyIn(
            `${chalk.underline.bold("Select difficulty:")}\n1. Easy\n2. Medium\n3. Impossible\n`,
            {
              limit: "123",
            }
          ) - 1
        ];

        console.log();
        const playerSymbol = keyIn(
          `${chalk.underline.bold("Select symbol:")}\n1. X\n2. O\n3. Random\n`,
          {
            limit: "123",
          }
        );

        currentPlayer =
          playerSymbol === "3" ? players[Math.floor(Math.random() * 2)] : players[playerSymbol - 1];

        playVsComputer(difficulty);
      } else {
        playMultiplayer();
      }
    };

    const playVsComputer = (difficulty) => {
      while (true) {
        const isPlayerTurn = currentPlayer === "X";

        if (isPlayerTurn) {
          let move;
          let errorMessage;
          do {
            displayBoard(errorMessage);
            errorMessage = null;
            move = keyIn(chalk.cyan("\nEnter position (1-9): "), { limit: "123456789" }) - 1;
            if (board[move] !== " ") {
              errorMessage = chalk.red("Position already taken!");
            }
          } while (board[move] !== " ");
          board[move] = currentPlayer;
        } else {
          board[computerMove(difficulty)] = currentPlayer;
        }

        if (checkWin()) {
          displayBoard();
          console.log(chalk.green(`\n${isPlayerTurn ? "You win!" : "Computer wins!"}`));
          break;
        }

        if (isBoardFull()) {
          displayBoard();
          console.log(chalk.yellow("\nIt's a draw!"));
          break;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
      }
    };

    const playMultiplayer = () => {
      currentPlayer = "X";
      while (true) {
        let errorMessage;
        let move;
        do {
          displayBoard(errorMessage);
          errorMessage = null;
          move =
            keyIn(chalk.cyan(`\nPlayer ${currentPlayer}'s turn. Enter position (1-9): `), {
              limit: "123456789",
            }) - 1;
          if (board[move] !== " ") {
            errorMessage = chalk.red("Position already taken!");
          }
        } while (board[move] !== " ");

        board[move] = currentPlayer;

        if (checkWin()) {
          displayBoard();
          console.log(chalk.green(`\nPlayer ${currentPlayer} wins!`));
          break;
        }

        if (isBoardFull()) {
          displayBoard();
          console.log(chalk.yellow("\nIt's a draw!"));
          break;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
      }
    };

    startGame();
    console.log();
  } catch (err) {
    Verbose.nonFatalError();
    _nonFatalError(err);
  }
};

module.exports = tictactoe;
