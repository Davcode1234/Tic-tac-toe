const startBtn = document.querySelector(".cta-btn");
const board = document.querySelector(".board");
const startScreen = document.querySelector(".starter-screen");
const topBar = document.querySelector(".top-bar");
const oponentMessage = document.querySelector(".oponent-paragraph");
const restartBtn = document.querySelector(".restart-btn");
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

let tiles = [],
  timeOutId;
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

const startGame = () => {
  startScreen.classList.add("hidden");
  board.classList.remove("hidden");
  topBar.classList.remove("hidden");
  board.classList.add("active");
  topBar.classList.add("active");
  if (state.AIMark == "x") {
    showOponentMessage();
    setTimeout(AIPick, 3000);
    disableBtn();
  }
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

const createBoard = () => {
  for (let i = 0; i < boardSize; i++) {
    const tile = document.createElement("button");
    tile.classList.add("tile", "empty");
    tiles.push(tile);
    board.appendChild(tile);
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

const disableBtn = () => {
  tiles.forEach((tile) => {
    tile.disabled = true;
    tile.style.cursor = "default";
    setTimeout(() => {
      tile.disabled = false;
      tile.style.cursor = "pointer";
    }, 3000);
  });
};

const showOponentMessage = () => {
  oponentMessage.classList.remove("hidden");
};

const playerPick = (tile) => {
  const mark = document.createElement("img");
  mark.src = `./images/icons/icon-${state.playerMark}.svg`;
  mark.classList.add("markImage");
  disableBtn();
  removePreviewMark(tile);
  handleMarkRender(tile, mark);
  switchTurn();
  renderCurrentTurnMark();
  showOponentMessage();
};

const AIPick = () => {
  const emptySpaces = document.querySelectorAll(".empty");
  const randomIndex = Math.floor(Math.random() * emptySpaces.length);
  const mark = document.createElement("img");
  mark.src = `./images/icons/icon-${state.AIMark}.svg`;
  mark.classList.add("markImage");

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
    highlightWinnerTiles(`${state.AIMark}`);
  }
  oponentMessage.classList.add("hidden");
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
  tileClickTimeout = setTimeout(AIPick, 3000);
  if (checkWin(`${state.playerMark}`)) {
    highlightWinnerTiles(`${state.playerMark}`);
    clearTimeout(tileClickTimeout);
    oponentMessage.classList.add("hidden");
  }
};

const handleTileHover = (e) => {
  e.preventDefault();
  const tile = e.currentTarget;
  if (tile.classList.contains("full")) {
    return;
  } else if (e.type === "mouseover") {
    tile.classList.add(`preview-${state.playerMark}`);
  } else if (e.type === "mouseleave") {
    tile.classList.remove(`preview-${state.playerMark}`);
  }
};

const closeModal = (background, content) => {
  background.classList.remove("active-modal");
  content.classList.remove("active-modal-content");
};

const handleModalOpen = (restart = false, xWon = false, oWon = false) => {
  const restartModal = document.querySelector(".restart-modal");
  const restartContent = document.querySelector(".modal-content");
  const paragraph = document.querySelector(".modal-content--paragraph");
  const cancelBtn = document.querySelector(".cancel-cta-btn");
  const restartBtn = document.querySelector(".restart-cta-btn");
  const btnWrapper = document.querySelectorAll(".btn-wrapper button");
  const btnContent = ["QUIT", "NEXT ROUND"];
  const [left, right] = btnContent;

  const addTextContent = (paragraphText, firstBtn, secondBtn) => {
    paragraph.textContent = paragraphText;
    cancelBtn.textContent = firstBtn;
    restartBtn.textContent = secondBtn;
  };
  if (restart) {
    addTextContent("RESTART GAME", "NO, CANCEL", "YES, RESTART");
  } else if (xWon) {
    addTextContent("X TAKES THE ROUND", `${left}`, `${right}`);
    paragraph.style.color = `#31c3bd`;
  } else if (oWon) {
    addTextContent("O TAKES THE ROUND", `${left}`, `${right}`);
    paragraph.style.color = `#f2b137`;
  }
  restartModal.classList.add("active-modal");
  restartContent.classList.add("active-modal-content");
  restartModal.addEventListener("click", () => {
    closeModal(restartModal, restartContent);
  });

  btnWrapper.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.dataset.modal === "restart") {
        restartGame();
        closeModal(restartModal, restartContent);
      } else if (e.target.dataset.modal === "cancel") {
        closeModal(restartModal, restartContent);
      }
    });
  });
};

function restartGame() {
  tiles.forEach((tile) => {
    tile.classList.remove("full");
    tile.classList.add("empty");

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
  if (state.AIMark == "x") {
    state.Xturn = true;
    renderCurrentTurnMark();
    showOponentMessage();
    clearTimeout(timeOutId);
    timeOutId = setTimeout(AIPick, 3000);
    disableBtn();
  }
  bindClickEvents();
}

const highlightWinnerTiles = (mark) => {
  winMap.forEach((combination) => {
    let check = combination.every((id) => {
      return tiles[id].classList.contains(mark);
    });

    if (check) {
      combination.forEach((winId) => {
        let tile = tiles[winId];
        let image = tile.firstChild;
        if (tile.classList.contains("x")) {
          tile.classList.add("x-won");
          image.src = "images/icons/icon-x-black.svg";
          handleModalOpen((restart = false), (xWon = true), (oWon = false));
        } else if (tile.classList.contains("o")) {
          tile.classList.add("o-won");
          image.src = "images/icons/icon-o-black.svg";
          handleModalOpen((restart = false), (xWon = false), (oWon = true));
        }
      });
    }
  });
  tiles.forEach((tile) => {
    tile.removeEventListener("click", handleTileClick);
  });
};
const checkWin = (mark) => {
  return winMap.some((combination) => {
    return combination.every((id) => {
      return tiles[id].classList.contains(mark);
    });
  });
};
const bindClickEvents = () => {
  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", () => {
    handleModalOpen((restart = true), (xWon = false), (oWon = false));
  });
  tiles.forEach((tile) => {
    tile.addEventListener("click", handleTileClick);
    tile.addEventListener("mouseover", handleTileHover);
    tile.addEventListener("mouseleave", handleTileHover);
  });
};

const init = () => {
  createBoard();
  bindClickEvents();
  playerPickMark();
};

init();
