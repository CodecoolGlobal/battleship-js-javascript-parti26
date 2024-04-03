import {
  displayBoard,
  displayMessage,
  displayTextMessage,
} from "./event-handlers.js";

let GAME_STATE = {
  currentBoard: [
    {
      boardNumber: 1,
      board: [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ],
    },
    {
      boardNumber: 2,
      board: [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
      ],
    },
  ],
  shootingPhase: true,
  placementPhase: false,
  turn: "You",
};

const shipPositions = {};

/**
 * This function is called when you choose the game mode.
 * The caller gives you the data about what kind of game
 * the AI would like to play and where it places its ships.
 * @param {String} gameDescription - An encoded string of the game data.
 *    You have to parse to use it.
 */

export function selectGame(gameDescription) {
  // You may delete the following line as an example to see what the data looks like.
  displayMessage(gameDescription, "black");

  // debugger;
  const parts = gameDescription.replace(/{|}/g, "").split(/,s:|,/);
  const boardSize = Number(parts.shift().charAt(5));
  parts.forEach((part) => {
    let [key, value] = part.split(":");
    key = key.trim();
    value = value.trim();
    shipPositions[key] = value;
  });

  console.log(`Size of the board: ${boardSize}`);
  console.table(shipPositions);
}

/**
 * Called whenever the player clicks on a cell.
 * @param {Object} clickProperties - The clicked cell's properties.
 *    It contains x and y coordinates, clickType that can be 'left' or 'right',
 *    and source that indicates the number of the board where the click happened.
 */
export function handleClick(clickProperties) {
  // You may delete the following line as an example to see what the data looks like.
  displayMessage(
    clickProperties.x +
      clickProperties.y +
      clickProperties.clickType +
      clickProperties.source
  );
  const x = clickProperties.x.codePointAt(0) - "A".codePointAt(0);
  const y = clickProperties.y - 1;
  const board = clickProperties.source - 1;
  const shoot = clickProperties.x.toLowerCase() + clickProperties.y;

  if (GAME_STATE.shootingPhase && board === 1 && GAME_STATE.turn === "You") {
    let hit = false;
    for (const shipPosition of Object.values(shipPositions)) {
      if (shipPosition === shoot) {
        hit = true;
      }
    }
    if (hit) {
      GAME_STATE.currentBoard[board].board[x][y] = "X";
      displayTextMessage("hit Your turn again", "red");
    } else {
      GAME_STATE.currentBoard[board].board[x][y] = "m";
      displayTextMessage("missed, AI's turn", "red");
      GAME_STATE.turn = "AI";
    }
  }

  displayBoard(GAME_STATE.currentBoard[0]);
  displayBoard(GAME_STATE.currentBoard[1]);
}

/**
 * Called when the player clicks on the reset game button.
 */
export function resetGame() {
  // You can delete the whole body of this function as an example.
  const board = [];
  for (let i = 0; i < 10; i++) {
    board.push([]);
    for (let j = 0; j < 10; j++) {
      board[i].push("");
    }
  }
  displayBoard({ boardNumber: 1, board: board });
  displayBoard({ boardNumber: 2, board: board });
}

/**
 * This function is called when the player clicks on the AI shoot button.
 * The caller gives you randomly generated coordinates.
 * You may ignore the parameter later when you implement more intelligent AI.
 * @param {Object} coordinates - Random generated coordinates (x and y),
 *    where the AI would like to shoot.
 */
export function aiShoot(coordinates) {
  // You may delete the following line as an example to see what the data looks like.
  displayMessage(coordinates.x + coordinates.y);
}

/*
Example to show how the three callable function looks in action.
The `displayBoard` function requires an object as an argument,
and it should have two properties:
`boardNumber` with 1 (left) or 2 (right) to decide where you would like to display,
and `board`, which should be a nested array to display.
`displayMessage` and `displayTextMessage` are functions to display messages:
They require two arguments: first is a string to display,
and the second is a color (can be text, RGB, RGBA, or hex color).
*/
displayBoard({
  boardNumber: 1,
  board: [
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ],
});
displayBoard({
  boardNumber: 2,
  board: [
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ],
});

displayBoard(GAME_STATE.currentBoard[0]);
displayBoard(GAME_STATE.currentBoard[1]);
displayMessage("message", "green");
displayTextMessage("text message", "red");
