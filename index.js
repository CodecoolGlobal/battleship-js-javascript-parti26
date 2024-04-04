/* eslint-disable indent */
import {
  displayBoard,
  displayMessage,
  displayTextMessage,
} from "./event-handlers.js";

let GAME_STATE = {
  boardSize: 0,
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
  userShipPositions: [],
  numOfShips: 2, //---> for now it is burnt in, depends on game mode (AI ships number)
  shootingPhase: false,
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

  console.log(`Size of the board: ${GAME_STATE.boardSize}`);
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
  //Use destructuring assignment to access object properties, improve code readability
  const { x, y, source } = clickProperties;
  
  const xCord = x.codePointAt(0) - "A".codePointAt(0);
  const yCord = y - 1;
  const board = source - 1;
  
  //source values: 1 (user grid), 2 (AI grid)
  switch (source) {
    case 1: //--> click source is form USER grid
      // Placement phase
      if (GAME_STATE.placementPhase && !GAME_STATE.shootingPhase) {
        //Save coordinates of the placed ship
        //Can not use numOfShips without GAME_STATE
        if (GAME_STATE.numOfShips > 0) {
          GAME_STATE.userShipPositions.push(x + y);
          displayMessage(x + source + y);
          GAME_STATE.numOfShips--;
          displayTextMessage(
            `You've left ${GAME_STATE.numOfShips} ships to place.`
          );
          //Put ship on the table
          GAME_STATE.currentBoard[board].board[xCord][yCord] = "O";
          displayBoard(GAME_STATE.currentBoard[board]);
        }
        if (GAME_STATE.numOfShips === 0) {
          GAME_STATE.placementPhase = false;
          GAME_STATE.shootingPhase = true;
        }
      }
      break;
    case 2: //--> click source is form AI grid
      if (!GAME_STATE.placementPhase && GAME_STATE.shootingPhase) {
        displayTextMessage("Shoot on AI board.");
        displayMessage(x + y);
        GAME_STATE.currentBoard[board].board[xCord][yCord] = "m";
        displayBoard(GAME_STATE.currentBoard[board]);
      }
      break;
    default:
      return null;
  }
if (GAME_STATE.shootingPhase && board === 1 && GAME_STATE.turn === "You") {
  let hit = false;
  for (const shipPosition of Object.values(shipPositions)) {
      if (shipPosition === shoot) {
        hit = true;
      }
    }
    if (hit) {
      GAME_STATE.currentBoard[board].board[x][y] = "X";
      displayTextMessage("hit, Your turn again", "red");
      displayBoard(GAME_STATE.currentBoard[1]);
    } else {
      GAME_STATE.currentBoard[board].board[x][y] = "m";
      displayTextMessage("missed, AI's turn", "red");
      GAME_STATE.turn = "AI";
      displayBoard(GAME_STATE.currentBoard[1]);
}
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

  const x = coordinates.x.codePointAt(0) - "A".codePointAt(0);
  const y = coordinates.y - 1;
  const board = 0;
  const shoot = GAME_STATE.currentBoard[board].board[x][y];

  if (GAME_STATE.shootingPhase && GAME_STATE.turn === "AI") {
    if (shoot === "O") {
      GAME_STATE.currentBoard[board].board[x][y] = "X";
      displayTextMessage("hit AI's turn again", "red");
    } else if (shoot === "") {
      GAME_STATE.currentBoard[board].board[x][y] = "m";
      displayTextMessage("missed, Your turn", "red");
      GAME_STATE.turn = "You";
    } else {
      displayTextMessage("AI is an idot. It's your turn", "red");
      GAME_STATE.turn = "You";
    }
  }
  displayBoard(GAME_STATE.currentBoard[0]);
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

displayMessage("message", "green");
displayTextMessage("text message", "red");
