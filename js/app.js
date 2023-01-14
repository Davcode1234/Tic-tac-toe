import openModal from "./modal.js";
import { checkWin, checkDraw } from "./result.js";
import {
  createBoard,
  tiles,
  startGame,
  quitGame,
  restartGame,
  showOponentMessage,
} from "./dom-utils.js";

const startBtn = document.querySelector(".cta-btn");
const quitBtn = document.querySelector(".quit-btn");
const oponentMessage = document.querySelector(".oponent-paragraph");
const restartBtn = document.querySelector(".restart-btn");
let player, XStart, restart, oWon, xWon, draw, tileClickTimeout, quit;
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

const playerWinsLSKey = "playerWins";
const AIWinsLSKey = "AIWins";
const drawsLSKey = "draws";

// Move tiles array to state object
export let state = {
  playerMark: "x",
  AIMark: "o",
  Xturn: true,
  playerScore: Number(localStorage.getItem(playerWinsLSKey)) || 0,
  AIScore: Number(localStorage.getItem(AIWinsLSKey)) || 0,
  draws: Number(localStorage.getItem(drawsLSKey)) || 0,
  AIPicking: false,
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

export const updateXTurn = () => {
  state = {
    ...state,
    Xturn: true,
  };
};

export const updateAIPicking = (bool) => {
  state = {
    ...state,
    AIPicking: bool,
  };
};

const switchTurn = () => {
  state.Xturn = !state.Xturn;
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

export const disableBtn = () => {
  tiles.forEach((tile) => {
    updateAIPicking(true);

    tile.style.cursor = "default";
    if (
      !checkWin("x", winMap, tiles) &&
      !checkWin("o", winMap, tiles) &&
      !checkDraw(tiles)
    ) {
      setTimeout(() => {
        updateAIPicking(false);
        tile.style.cursor = "pointer";
      }, 3000);
    }
  });
};

// const showOponentMessage = () => {
//   oponentMessage.classList.remove("hidden");
// };

export function disableMarkPreview(XStart = false) {
  const setTilesBckgroundSize = (size) => {
    tiles.forEach((tile) => {
      tile.style.backgroundSize = `${size}%`;
    });
  };
  if (!XStart) {
    setTilesBckgroundSize(0);
    setTimeout(() => {
      setTilesBckgroundSize(50);
    }, 3000);
  } else {
    setTilesBckgroundSize(50);
  }
}

const playerPick = (tile) => {
  const mark = document.createElement("img");
  mark.src = `./images/icons/icon-${state.playerMark}.svg`;
  mark.classList.add("markImage");
  removePreviewMark(tile);
  handleMarkRender(tile, mark);
  switchTurn();
  renderCurrentTurnMark();
  showOponentMessage();
  disableBtn();
  disableMarkPreview();
};

export const AIPick = () => {
  player = false;
  const emptySpaces = document.querySelectorAll(".empty");
  const randomIndex = Math.floor(Math.random() * emptySpaces.length);
  const mark = document.createElement("img");
  mark.src = `./images/icons/icon-${state.AIMark}.svg`;
  mark.classList.add("markImage");

  const randomTile = tiles[randomIndex];
  switchTurn();
  renderCurrentTurnMark();

  if (randomTile.classList.contains("empty")) {
    handleMarkRender(randomTile, mark, player);
  } else if (randomTile.classList.contains("full")) {
    const randomEmptyTile = Array.from(emptySpaces)[randomIndex];
    if (randomEmptyTile) {
      handleMarkRender(randomEmptyTile, mark, player);
    } else {
      return;
    }
  } else {
    return;
  }
  if (checkWin(`${state.AIMark}`, winMap, tiles)) {
    renderWinnerScreen(`${state.AIMark}`);
    localStorage.setItem(AIWinsLSKey, state.AIScore + 1);

    state = {
      ...state,
      AIScore: state.AIScore + 1,
    };
    renderScore();
  } else if (checkDraw(tiles)) {
    renderDrawScreen();
  }
  oponentMessage.classList.add("hidden");
};

export const renderCurrentTurnMark = () => {
  const currentTurnMark = document.querySelector(".turn-mark");
  if (state.Xturn) {
    currentTurnMark.src = `images/icons/icon-x-grey.svg`;
  } else {
    currentTurnMark.src = `./images/icons/icon-o-grey.svg`;
  }
};

const handleTileHover = (e) => {
  e.preventDefault();
  const tile = e.currentTarget;

  if (tile.classList.contains("full")) {
    return;
  } else if (e.type === "mouseenter") {
    tile.classList.add(`preview-${state.playerMark}`);
  } else if (e.type === "mouseleave") {
    tile.classList.remove(`preview-${state.playerMark}`);
  } else if (e.type === "mousemove") {
    tile.classList.add(`preview-${state.playerMark}`);
  }
};

const handleTileClick = (e) => {
  if (state.AIPicking) {
    return;
  }
  e.preventDefault();
  const tile = e.target;
  playerPick(tile);
  tileClickTimeout = setTimeout(AIPick, 3000);
  if (checkWin(`${state.playerMark}`, winMap, tiles)) {
    renderWinnerScreen(`${state.playerMark}`);
    clearTimeout(tileClickTimeout);
    oponentMessage.classList.add("hidden");
    localStorage.setItem(playerWinsLSKey, state.playerScore + 1);
    state = {
      ...state,
      playerScore: state.playerScore + 1,
    };
    renderScore();
  } else if (checkDraw(tiles)) {
    renderDrawScreen();
  }
};

const renderDrawScreen = () => {
  restart = false;
  oWon = false;
  xWon = false;
  draw = true;
  clearTimeout(tileClickTimeout);
  oponentMessage.classList.add("hidden");
  localStorage.setItem(drawsLSKey, state.draws + 1);
  state = {
    ...state,
    draws: state.draws + 1,
  };
  renderScore();
  openModal(restart, xWon, oWon, draw, state, quit, restartGame, quitGame);
};
const renderWinnerScreen = (mark) => {
  winMap.forEach((combination) => {
    let check = combination.every((id) => {
      return tiles[id].classList.contains(mark);
    });

    if (check) {
      combination.forEach((winId) => {
        let tile = tiles[winId];
        let image = tile.firstChild;
        if (tile.classList.contains("x")) {
          restart = false;
          oWon = false;
          draw = false;
          xWon = true;
          tile.classList.add("x-won");
          image.src = "images/icons/icon-x-black.svg";
          openModal(
            restart,
            xWon,
            oWon,
            draw,
            state,
            quit,
            restartGame,
            quitGame
          );
        } else if (tile.classList.contains("o")) {
          restart = false;
          xWon = false;
          draw = false;
          oWon = true;
          tile.classList.add("o-won");
          image.src = "images/icons/icon-o-black.svg";
          openModal(
            restart,
            xWon,
            oWon,
            draw,
            state,
            quit,
            restartGame,
            quitGame
          );
        }
      });
    }
  });
};

export const renderScore = () => {
  const ties = document.querySelector(".ties-score");
  const playerScore = document.querySelector(".player-score");
  const AIScore = document.querySelector(".AI-score");
  const paragraphs = document.querySelectorAll(".score-tile-paragraph");
  const playerTile = document.querySelector(".player-tile");
  const AITile = document.querySelector(".AI-tile");

  playerScore.textContent = state.playerScore;
  AIScore.textContent = state.AIScore;
  ties.textContent = state.draws;

  if (state.playerMark === "x") {
    paragraphs[0].textContent = "X (YOU)";
    paragraphs[2].textContent = "O (CPU)";
    AITile.style.backgroundColor = "var(--color-orange)";
  } else if (state.playerMark === "o") {
    paragraphs[0].textContent = "O (YOU)";
    playerTile.style.backgroundColor = "var(--color-orange)";
    paragraphs[2].textContent = "X (CPU)";
  }
};

export function bindEventsToTiles() {
  tiles.forEach((tile) => {
    tile.addEventListener("click", handleTileClick);
    tile.addEventListener("mouseenter", handleTileHover);
    tile.addEventListener("mouseleave", handleTileHover);
  });
}

const bindClickEvents = () => {
  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", () => {
    restart = true;
    xWon = false;
    oWon = false;
    draw = false;
    openModal(restart, xWon, oWon, draw, state, quit, restartGame, quitGame);
  });

  bindEventsToTiles();
  quitBtn.addEventListener("click", quitGame);
};

const init = () => {
  createBoard();
  bindClickEvents();
  playerPickMark();
};

init();
