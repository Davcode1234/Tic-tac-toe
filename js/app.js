const startBtn = document.querySelector(".cta-btn");
const board = document.querySelector(".board");
const startScreen = document.querySelector(".starter-screen");
const topBar = document.querySelector(".top-bar");
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
  Xturn: true,
  playerScore: 0,
  AIScore: 0,
  draws: 0,
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

// const updateCurrentTurn = (current) => {
//   state = {
//     ...state,
//     currentTurn: current,
//   };
// };

const switchTurn = () => {
  state.Xturn = !state.Xturn;
  console.log(state.Xturn);
};

const slideMarkChoiceContainer = () => {
  const container = document.querySelector(".marks-choice");

  const xBtn = document.querySelector(".x-btn");
  const oBtn = document.querySelector(".o-btn");

  if (container.classList.contains("x-mark")) {
    container.classList.remove("x-mark");
    container.classList.add("y-mark");
    oBtn.src = "images/icons/icon-o-black.svg";
    xBtn.src = "images/icons/icon-x-grey.svg";
  } else {
    container.classList.remove("y-mark");
    container.classList.add("x-mark");
    oBtn.src = "images/icons/icon-o-grey.svg";
    xBtn.src = "images/icons/icon-x-black.svg";
  }
};

const playerPickMark = () => {
  document.querySelectorAll(".mark").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      updatePlayerMark(e.target.dataset.mark);
      updateAIMark();
      slideMarkChoiceContainer();
    });
  });
};

const createBoard = () => {
  for (let i = 0; i < boardSize; i++) {
    const tile = document.createElement("button");
    tile.classList.add("tile", "empty");
    tiles.push(tile);
    board.appendChild(tile);
  }
};

const startGame = () => {
  startScreen.classList.add("hidden");
  board.classList.remove("hidden");
  topBar.classList.remove("hidden");
  board.classList.add("active");
  topBar.classList.add("active");
  if (state.AIMark == "x") {
    setTimeout(AIPick, 1000);
    disableBtn();
  }
};

const handleClick = () => {
  startGame();
};

const removePreviewMark = (tile) => {
  if (tile.classList.contains(`preview-${state.playerMark}`)) {
    tile.classList.remove(`preview-${state.playerMark}`);
  }
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
  removePreviewMark(tile);
};

const disableBtn = () => {
  tiles.forEach((tile) => {
    tile.disabled = true;
    setTimeout(() => {
      tile.disabled = false;
    }, 1500);
  });
};

const playerPick = (tile) => {
  const mark = document.createElement("img");
  mark.src = `./images/icons/icon-${state.playerMark}.svg`;
  disableBtn();
  removePreviewMark(tile);
  handleMarkRender(tile, mark);
  switchTurn();
  renderCurrentTurnMark();
};

const AIPick = () => {
  const emptySpaces = document.querySelectorAll(".empty");
  const randomIndex = Math.floor(Math.random() * emptySpaces.length);
  const mark = document.createElement("img");
  mark.src = `./images/icons/icon-${state.AIMark}.svg`;
  const randomTile = tiles[randomIndex];
  switchTurn();
  renderCurrentTurnMark();

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

const renderCurrentTurnMark = () => {
  const currentTurnMark = document.querySelector(".turn-mark");
  if (state.Xturn) {
    currentTurnMark.src = `images/icons/icon-x-grey.svg`;
  } else {
    currentTurnMark.src = `./images/icons/icon-o-grey.svg`;
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

const handleTileHover = (e) => {
  e.preventDefault();
  const tile = e.target;
  if (tile.classList.contains("full")) {
    return;
  } else if (e.type === "mouseenter") {
    tile.classList.add(`preview-${state.playerMark}`);
  } else if (e.type === "mouseleave") {
    tile.classList.remove(`preview-${state.playerMark}`);
  }
};

const bindClickEvents = () => {
  tiles.forEach((tile) => {
    tile.addEventListener("click", handleTileClick);
    tile.addEventListener("mouseenter", handleTileHover);
    tile.addEventListener("mouseleave", handleTileHover);
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
