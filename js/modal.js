const closeModal = (background, content) => {
  background.classList.remove("active-modal");
  content.classList.remove("active-modal-content");
};

const handleModalOpen = (
  restart = false,
  xWon = false,
  oWon = false,
  draw = false,
  state,
  quit,
  restartGameCallback,
  quitGameCallback
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
        quit = false;
        closeModal(restartModal, restartContent);
        restartGameCallback(quit);
      } else if (
        e.target.dataset.modal === "cancel" &&
        btn.textContent === "QUIT"
      ) {
        closeModal(restartModal, restartContent);
        quitGameCallback();
        // restartGame((quit = true));
      } else if (
        e.target.dataset.modal === "cancel" &&
        btn.textContent === "NO, CANCEL"
      ) {
        closeModal(restartModal, restartContent);
      }
    });
  });
};

export default handleModalOpen;
