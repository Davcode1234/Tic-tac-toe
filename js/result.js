import openModal from "./modal.js";

export const checkWin = (mark, winMap, tiles) => {
  return winMap.some((combination) => {
    return combination.every((id) => {
      return tiles[id].classList.contains(mark);
    });
  });
};

export const checkDraw = (tiles) => {
  return tiles.every((tile) => {
    return tile.classList.contains("full");
  });
};

//There is an error that occurs due to missing arguments

// export const renderWinnerScreen = (mark, winMap, tiles) => {
//   winMap.forEach((combination) => {
//     let check = combination.every((id) => {
//       return tiles[id].classList.contains(mark);
//     });

//     if (check) {
//       combination.forEach((winId) => {
//         let tile = tiles[winId];
//         let image = tile.firstChild;
//         if (tile.classList.contains("x")) {
//           restart = false;
//           oWon = false;
//           draw = false;
//           xWon = true;
//           tile.classList.add("x-won");
//           image.src = "images/icons/icon-x-black.svg";
//           handleModalOpen(
//             restart,
//             xWon,
//             oWon,
//             draw,
//             state,
//             quit,
//             restartGame,
//             quitGame
//           );
//         } else if (tile.classList.contains("o")) {
//           restart = false;
//           xWon = false;
//           draw = false;
//           oWon = true;
//           tile.classList.add("o-won");
//           image.src = "images/icons/icon-o-black.svg";
//           handleModalOpen(
//             restart,
//             xWon,
//             oWon,
//             draw,
//             state,
//             quit,
//             restartGame,
//             quitGame
//           );
//         }
//       });
//     }
//   });
// };

// export const renderDrawScreen = () => {
//   restart = false;
//   oWon = false;
//   xWon = false;
//   draw = true;
//   clearTimeout(tileClickTimeout);
//   oponentMessage.classList.add("hidden");
//   localStorage.setItem(drawsLSKey, state.draws + 1);
//   state = {
//     ...state,
//     draws: state.draws + 1,
//   };
//   renderScore();
//   handleModalOpen(
//     restart,
//     xWon,
//     oWon,
//     draw,
//     state,
//     quit,
//     restartGame,
//     quitGame
//   );
// };
