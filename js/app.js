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

let state = {
  playerMark: "x",
  AIMark: "o",
  playerScore: 0,
  AIScore: 0,
  draws: 0,
};

const playerPickMark = () => {
  document.querySelectorAll(".mark").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      updatePlayerMark(e.target.dataset.mark);
      updateAIMark();
    });
  });
};

const updateAIMark = () => {
  if (state.playerMark == "x") {
    state = {
      ...state,
      AIMark: "o",
    };
  } else {
    state = {
      ...state,
      AIMark: "x",
    };
  }
};

const updatePlayerMark = (pickedOption) => {
  state = {
    ...state,
    playerMark: pickedOption,
  };
};

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
  console.log("Player", state.playerMark);
  console.log("AI", state.AIMark);
  if (state.AIMark == "x") {
    setTimeout(AIPick, 1000);
  }
};

const handleClick = () => {
  startGame();
};

const handleMarkRender = (tile, mark, player = true) => {
  let tileClass = "";
  player
    ? (tileClass = `${state.playerMark}`)
    : (tileClass = `${state.AIMark}`);
  tile.appendChild(mark);
  tile.classList.remove("empty");
  tile.classList.add("full");
  tile.classList.add(tileClass);
  tile.removeEventListener("click", handleTileClick);
};

const playerPick = (tile) => {
  const mark = document.createElement("img");
  mark.src = `./images/icons/icon-${state.playerMark}.svg`;
  handleMarkRender(tile, mark);
};

const AIPick = () => {
  const emptySpaces = document.querySelectorAll(".empty");
  const randomIndex = Math.floor(Math.random() * emptySpaces.length);
  const mark = document.createElement("img");
  mark.src = `./images/icons/icon-${state.AIMark}.svg`;
  const randomTile = tiles[randomIndex];

  if (randomTile.classList.contains("empty")) {
    handleMarkRender(randomTile, mark, (player = false));
  } else if (randomTile.classList.contains("full")) {
    const randomEmptyTile = Array.from(emptySpaces)[randomIndex];
    if (randomEmptyTile) {
      handleMarkRender(randomEmptyTile, mark, (player = false));
    } else {
      return;
    }
  } else {
    return;
  }
  if (checkWin(`${state.AIMark}`)) {
    alert("Computer won");
  }
};

const handleTileClick = (e) => {
  e.preventDefault();
  const tile = e.target;
  playerPick(tile);
  setTimeout(AIPick, 1000);
  if (checkWin(`${state.playerMark}`)) {
    alert("Player won");
  }
};

const bindClickEvents = () => {
  tiles.forEach((tile) => {
    tile.addEventListener("click", handleTileClick);
  });
};
const checkWin = (mark) => {
  return winMap.some((combination) => {
    return combination.every((id) => {
      return tiles[id].classList.contains(mark);
    });
  });
};

startBtn.addEventListener("click", handleClick);

const init = () => {
  createBoard();
  bindClickEvents();
  playerPickMark();
};

init();
