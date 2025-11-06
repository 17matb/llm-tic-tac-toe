const gameBoardElement = document.querySelector('.game-board');
const startButtonElement = document.querySelector('.start-button');
const statusElement = document.querySelector('.status');

const gameBoardContent = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

let currentPlayer = '';
let gameBoardSize = 3;

const isGameOver = () => {
  const nbOfCellsToWin = gameBoardSize === 10 ? 5 : 3;
  let winner = '';

  // horizontal
  for (let row = 0; row < gameBoardContent.length; row++) {
    for (
      let col = 0;
      col <= gameBoardContent[row].length - nbOfCellsToWin;
      col++
    ) {
      if (gameBoardContent[row][col] !== '') {
        let isEveryCellGood = true;

        for (i = 1; i < nbOfCellsToWin; i++) {
          if (gameBoardContent[row][col] !== gameBoardContent[row][col + i]) {
            isEveryCellGood = false;
            break;
          }
        }

        if (isEveryCellGood) {
          winner = gameBoardContent[row][col];
          break;
        }
      }
    }
  }

  // vertical
  for (let col = 0; col < gameBoardContent[0].length; col++) {
    for (let row = 0; row <= gameBoardContent.length - nbOfCellsToWin; row++) {
      if (gameBoardContent[row][col] !== '') {
        let isEveryCellGood = true;

        for (i = 1; i < nbOfCellsToWin; i++) {
          if (gameBoardContent[row][col] !== gameBoardContent[row + i][col]) {
            isEveryCellGood = false;
            break;
          }
        }

        if (isEveryCellGood) {
          winner = gameBoardContent[row][col];
          break;
        }
      }
    }
  }

  // diagonal to bottom right hand corner
  for (let row = 0; row <= gameBoardContent.length - nbOfCellsToWin; row++) {
    for (
      let col = 0;
      col <= gameBoardContent[row].length - nbOfCellsToWin;
      col++
    ) {
      if (gameBoardContent[row][col] !== '') {
        let isEveryCellGood = true;

        for (i = 1; i < nbOfCellsToWin; i++) {
          if (
            gameBoardContent[row][col] !== gameBoardContent[row + i][col + i]
          ) {
            isEveryCellGood = false;
            break;
          }
        }

        if (isEveryCellGood) {
          winner = gameBoardContent[row][col];
          break;
        }
      }
    }
  }

  // diagonal to bottom left hand corner
  for (let row = 0; row <= gameBoardContent.length - nbOfCellsToWin; row++) {
    for (
      let col = nbOfCellsToWin - 1;
      col < gameBoardContent[row].length;
      col++
    ) {
      if (gameBoardContent[row][col] !== '') {
        let isEveryCellGood = true;

        for (i = 1; i < nbOfCellsToWin; i++) {
          if (
            gameBoardContent[row][col] !== gameBoardContent[row + i][col - i]
          ) {
            isEveryCellGood = false;
            break;
          }
        }

        if (isEveryCellGood) {
          winner = gameBoardContent[row][col];
          break;
        }
      }
    }
  }

  if (winner) return winner;
  return null;
};

const setCurrentPlayer = (newPlayer, modelName) => {
  // newPlayer: string ('x' or 'o')
  // modelName: string (provided by api?)
  currentPlayer = newPlayer;
  statusElement.classList.remove('o-playing', 'x-playing');
  statusElement.classList.add(`${newPlayer}-playing`);
  statusElement.innerHTML = `C'est au tour de <strong>${modelName}</strong> de jouer avec ${modelName === 'x' ? 'la croix' : 'le cercle'}.`;
};

const showGameBoard = () => {
  gameBoardElement.innerHTML = '';
  for (let row = 0; row < gameBoardContent.length; row++) {
    for (let cell = 0; cell < gameBoardContent[row].length; cell++) {
      const cellValue = gameBoardContent[row][cell];
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      if (cellValue === 'x') cellElement.classList.add('x-value');
      if (cellValue === 'o') cellElement.classList.add('o-value');
      gameBoardElement.appendChild(cellElement);
    }
  }
};

const nextTurn = () => {
  gameBoardElement.classList.remove('hidden');
  if (!currentPlayer) setCurrentPlayer('x', 'qwen3:14b');
  if (currentPlayer === 'x') setCurrentPlayer('o', 'phi3:3.8b');
  if (currentPlayer === 'o') setCurrentPlayer('x', 'qwen3:14b');
  // fetch(API_URL, {
  //   method: 'POST',
  //   body: JSON.stringify(gameBoardContent),
  //   headers: { 'Content-Type': 'application/json' },
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log(data);
  //   });
  showGameBoard();
};

startButtonElement.addEventListener('click', () => {
  nextTurn();
});
