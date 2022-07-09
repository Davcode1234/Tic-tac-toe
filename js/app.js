const startBtn = document.querySelector(".cta-btn");
const board = document.querySelector(".board");
const startScreen = document.querySelector(".starter-screen");
const winMap = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let tiles = [];
const boardSize = 9;

// let state = {
//     playerMark:
// }

const createBoard = () => {
  for (let i = 0; i < boardSize; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile", "empty");
    tiles.push(tile);
    board.appendChild(tile);
  }
};

const startGame = () => {
  startScreen.classList.add("hidden");
  board.classList.remove("hidden");
  board.classList.add("active");
};

const handleClick = () => {
  startGame();
};
const handleMarkRender = (tile, mark) => {
  tile.appendChild(mark);
  tile.classList.remove("empty");
  tile.classList.add("full");
  tile.classList.add("X");
  tile.removeEventListener("click", handleTileClick);
};

const playerPick = (tile) => {
  const mark = document.createElement("img");
  mark.src = "./images/icons/icon-x.svg";
  handleMarkRender(tile, mark);
};

const AIPick = () => {
  const emptySpaces = document.querySelectorAll(".empty");
  const randomIndex = Math.floor(Math.random() * emptySpaces.length);
  const mark = document.createElement("img");
  mark.src = "./images/icons/icon-o.svg";
  const randomTile = tiles[randomIndex];

  if (randomTile.classList.contains("empty")) {
    handleMarkRender(randomTile, mark);
  } else if (randomTile.classList.contains("full")) {
    const randomEmptyTile = Array.from(emptySpaces)[randomIndex];
    if (randomEmptyTile) {
      handleMarkRender(randomEmptyTile, mark);
    } else {
      return;
    }
  } else {
    return;
  }
};

const handleTileClick = (e) => {
  e.preventDefault();
  const tile = e.target;
  playerPick(tile);
  AIPick();
  if (checkIfWin()) {
    console.log("X won");
  }
};

const checkIfWin = () => {
  return winMap.some((combination) => {
    return combination.every((id) => {
      return tiles[id].classList.contains("X");
    });
  });
};

startBtn.addEventListener("click", handleClick);

const init = () => {
  createBoard();
};

init();

tiles.forEach((tile) => {
  tile.addEventListener("click", handleTileClick);
});
