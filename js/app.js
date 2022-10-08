const startBtn = document.querySelector(".cta-btn");
const board = document.querySelector(".board");
const startScreen = document.querySelector(".starter-screen");
const topBar = document.querySelector(".top-bar");
const oponentMessage = document.querySelector(".oponent-paragraph");
const restartBtn = document.querySelector(".restart-btn");
const scoreBoard = document.querySelector(".score-board");
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
let tiles = [],
  timeOutId;
const boardSize = 9;
let AIPicking = false;

let state = {
  playerMark: "x",
  AIMark: "o",
  Xturn: true,
  playerScore: Number(localStorage.getItem(playerWinsLSKey)) || 0,
  AIScore: Number(localStorage.getItem(AIWinsLSKey)) || 0,
  draws: Number(localStorage.getItem(drawsLSKey)) || 0,
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
  scoreBoard.style.display = "flex";
  if (state.AIMark == "x") {
    showOponentMessage();
    setTimeout(AIPick, 3000);
    disableBtn();
  }
  state = {
    ...state,
    Xturn: true,
  };

  renderCurrentTurnMark();

  renderScore();
};
const createBoard = () => {
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

function restartGame() {
  clearBoard();
  state.Xturn = true;
  renderCurrentTurnMark();
  AIPicking = false;
  if (state.AIMark === "x") {
    showOponentMessage();
    clearTimeout(timeOutId);
    timeOutId = setTimeout(AIPick, 3000);
    disableBtn();
    AIPicking = true;
    disableMarkPreview(0);
  }
  disableMarkPreview(50);
  bindClickEvents();
}

const quitGame = () => {
  startScreen.classList.remove("hidden");
  board.classList.add("hidden");
  topBar.classList.add("hidden");
  board.classList.remove("active");
  topBar.classList.remove("active");
  scoreBoard.style.display = "none";
  clearBoard();
  if (state.playerMark === "x") {
    disableMarkPreview(50);
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
    // tile.disabled = true;
    AIPicking = true;

    tile.style.cursor = "default";
    if (!checkWin("x") && !checkWin("o") && !checkDraw()) {
      setTimeout(() => {
        AIPicking = false;
        // tile.disabled = false;
        tile.style.cursor = "pointer";
      }, 3000);
    }
  });
};

const showOponentMessage = () => {
  oponentMessage.classList.remove("hidden");
};

function disableMarkPreview(size) {
  tiles.forEach((tile) => {
    tile.style.backgroundSize = `${size}%`;
  });
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
  disableMarkPreview(0);
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
    localStorage.setItem(AIWinsLSKey, state.AIScore + 1);

    state = {
      ...state,
      AIScore: state.AIScore + 1,
    };
    renderScore();
  } else if (checkDraw()) {
    renderDrawScreen();
  }
  oponentMessage.classList.add("hidden");

  disableMarkPreview(50);
};

const renderCurrentTurnMark = () => {
  const currentTurnMark = document.querySelector(".turn-mark");
  if (state.Xturn) {
    currentTurnMark.src = `images/icons/icon-x-grey.svg`;
  } else {
    currentTurnMark.src = `./images/icons/icon-o-grey.svg`;
  }
};

const handleTileHover = (e) => {
  // e.preventDefault();
  const tile = e.currentTarget;

  // tiles.forEach((tile) => {
  //   if (AIPicking) {
  //     tile.style.backgroundSize = "0%";
  //   } else if (!AIPicking) {
  //     tile.style.backgroundSize = "50%";
  //   }
  // });

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
  if (AIPicking) {
    return;
  }
  e.preventDefault();
  const tile = e.target;
  playerPick(tile);
  tileClickTimeout = setTimeout(AIPick, 3000);
  if (checkWin(`${state.playerMark}`)) {
    highlightWinnerTiles(`${state.playerMark}`);
    clearTimeout(tileClickTimeout);
    oponentMessage.classList.add("hidden");
    localStorage.setItem(playerWinsLSKey, state.playerScore + 1);
    state = {
      ...state,
      playerScore: state.playerScore + 1,
    };
    renderScore();
  } else if (checkDraw()) {
    renderDrawScreen();
  }
};

const renderDrawScreen = () => {
  clearTimeout(tileClickTimeout);
  oponentMessage.classList.add("hidden");
  localStorage.setItem(drawsLSKey, state.draws + 1);
  state = {
    ...state,
    draws: state.draws + 1,
  };
  renderScore();
  handleModalOpen(
    (restart = false),
    (xWon = false),
    (oWon = false),
    (draw = true)
  );
};

const closeModal = (background, content) => {
  background.classList.remove("active-modal");
  content.classList.remove("active-modal-content");
};

const handleModalOpen = (
  restart = false,
  xWon = false,
  oWon = false,
  draw = false
) => {
  const restartModal = document.querySelector(".restart-modal");
  const restartContent = document.querySelector(".modal-content");
  const paragraph = document.querySelector(".modal-content--paragraph");
  const decisionParagraph = document.querySelector(".decision-paragraph");
  const mark = document.querySelector(".modal-content--img");
  const cancelBtn = document.querySelector(".cancel-cta-btn");
  const restartBtn = document.querySelector(".restart-cta-btn");
  const btnWrapper = document.querySelectorAll(".btn-wrapper button");
  const btnContent = ["QUIT", "NEXT ROUND"];
  const [left, right] = btnContent;

  const addTextContent = (
    paragraphText,
    decisionParagraphText,
    firstBtn,
    secondBtn,
    markSrc
  ) => {
    paragraph.textContent = paragraphText;
    decisionParagraph.textContent = decisionParagraphText;
    cancelBtn.textContent = firstBtn;
    restartBtn.textContent = secondBtn;
    mark.src = markSrc;
  };

  if (restart) {
    addTextContent("RESTART GAME", "", "NO, CANCEL", "YES, RESTART");
  } else if (xWon) {
    addTextContent(
      `TAKES THE ROUND`,
      state.playerMark === "x" ? `You won!` : "Oops, you lost...",
      `${left}`,
      `${right}`,
      `./images/icons/icon-x.svg`
    );
    paragraph.style.color = `#31c3bd`;
  } else if (oWon) {
    addTextContent(
      `TAKES THE ROUND`,
      state.playerMark === "o" ? `You won!` : "Oops, you lost...",
      `${left}`,
      `${right}`,
      `./images/icons/icon-o.svg`
    );
    paragraph.style.color = `#f2b137`;
  } else if (draw) {
    addTextContent("DRAW", "", `${left}`, `${right}`);
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
      } else if (
        e.target.dataset.modal === "cancel" &&
        btn.textContent === "QUIT"
      ) {
        closeModal(restartModal, restartContent);
        quitGame();
        // restartGame();
      } else if (
        e.target.dataset.modal === "cancel" &&
        btn.textContent === "NO, CANCEL"
      ) {
        closeModal(restartModal, restartContent);
      }
    });
  });
};

const renderScore = () => {
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
};
const checkWin = (mark) => {
  return winMap.some((combination) => {
    return combination.every((id) => {
      return tiles[id].classList.contains(mark);
    });
  });
};

const checkDraw = () => {
  return tiles.every((tile) => {
    return tile.classList.contains("full");
  });
};

const bindClickEvents = () => {
  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", () => {
    handleModalOpen(
      (restart = true),
      (xWon = false),
      (oWon = false),
      (draw = false)
    );
  });
  tiles.forEach((tile) => {
    tile.addEventListener("click", handleTileClick);
    tile.addEventListener("mouseenter", handleTileHover);
    tile.addEventListener("mouseleave", handleTileHover);
    // tile.addEventListener("mousemove", handleTileHover);
  });
};

const init = () => {
  createBoard();
  bindClickEvents();
  playerPickMark();
};

init();
