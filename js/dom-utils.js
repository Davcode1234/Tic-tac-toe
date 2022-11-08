import {
  state,
  disableMarkPreview,
  updateXTurn,
  renderCurrentTurnMark,
  renderScore,
  AIPick,
  disableBtn,
  updateAIPicking,
  bindEventsToTiles,
} from "./app.js";

const board = document.querySelector(".board");
const startScreen = document.querySelector(".starter-screen");
const gameScreen = document.querySelector(".game-screen");
const topBar = document.querySelector(".top-bar");
const scoreBoard = document.querySelector(".score-board");
const quitBtn = document.querySelector(".quit-btn");
const oponentMessage = document.querySelector(".oponent-paragraph");

let XStart, quit;
export let tiles = [];
const boardSize = 9;

export const createBoard = () => {
  for (let i = 0; i < boardSize; i++) {
    const tile = document.createElement("button");
    tile.classList.add("tile", "empty");
    tiles.push(tile);
    board.appendChild(tile);
  }
};

function clearBoard() {
  tiles.forEach((tile) => {
    tile.classList.remove("full");
    tile.classList.add("empty");
    tile.style.cursor = "pointer";
    tile.disabled = false;

    tile.classList.contains("x")
      ? tile.classList.remove("x")
      : tile.classList.remove("o");

    tile.classList.contains("x-won")
      ? tile.classList.remove("x-won")
      : tile.classList.remove("o-won");
    if (tile.hasChildNodes()) {
      const mark = document.querySelector(".markImage");
      tile.removeChild(mark);
    }
  });
}

export const startGame = () => {
  XStart = true;
  const setClassesToStartScreen = (classs) => {
    startScreen.classList.add(classs);
  };

  const setClassesToGameScreen = (classs) => {
    // board.classList.add(classs);
    // topBar.classList.add(classs);
    gameScreen.classList.add(classs);
  };

  setClassesToStartScreen("slide-out");
  setTimeout(() => {
    setClassesToStartScreen("hidden");
  }, 1000);
  setClassesToGameScreen("slide-in");

  board.classList.remove("hidden");
  topBar.classList.remove("hidden");
  quitBtn.classList.remove("hidden");

  scoreBoard.style.display = "flex";
  if (state.AIMark == "x") {
    showOponentMessage();
    setTimeout(AIPick, 3000);
    disableBtn();
    disableMarkPreview();
  } else {
    disableMarkPreview(XStart);
  }
  updateXTurn();

  renderCurrentTurnMark();
  renderScore();
};

export const restartGame = (quit = false) => {
  XStart = true;
  clearBoard();
  state.Xturn = true;
  renderCurrentTurnMark();
  updateAIPicking(false);
  if (state.AIMark === "x" && !quit) {
    showOponentMessage();
    clearTimeout(timeOutId);
    timeOutId = setTimeout(AIPick, 3000);
    disableBtn();
    updateAIPicking(true);
    disableMarkPreview();
  } else {
    disableMarkPreview(XStart);
  }
  bindEventsToTiles();
};

export const quitGame = () => {
  gameScreen.classList.remove("slide-in");
  startScreen.classList.remove("hidden");
  setTimeout(() => {
    startScreen.classList.remove("slide-out");
  }, 100);
  restartGame((quit = true));
};

export const showOponentMessage = () => {
  oponentMessage.classList.remove("hidden");
};
