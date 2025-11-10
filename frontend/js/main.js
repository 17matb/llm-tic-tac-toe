const gameBoardElement = document.querySelector('.game-board');
const startButtonElement = document.querySelector('.start-button');
const statusElement = document.querySelector('.status');

const gameBoardContent = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

let currentPlayer = 'x';
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

const setCurrentPlayerStatus = (modelName) => {
  statusElement.classList.remove('o-playing', 'x-playing');
  statusElement.classList.add(`${currentPlayer}-playing`);
  statusElement.innerHTML = `C'est au tour de <strong>${modelName}</strong> de jouer avec ${currentPlayer === 'x' ? 'la croix' : 'le cercle'}.`;
};

const toggleCurrentPlayer = (modelName) => {
  if (currentPlayer === 'x') {
    currentPlayer = 'o';
    setCurrentPlayerStatus(modelName);
    return;
  }
  if (currentPlayer === 'o') {
    currentPlayer = 'x';
    setCurrentPlayerStatus(modelName);
    return;
  }
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

const nextTurn = async () => {
  gameBoardElement.classList.remove('hidden');
  showGameBoard();

  const response = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      board: gameBoardContent,
      turn: currentPlayer,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  console.log(data);

  gameBoardContent[data.move.row][data.move.col] = currentPlayer;
  fetchedData = data;

  showGameBoard();
  toggleCurrentPlayer(data.model_used);
};

startButtonElement.addEventListener('click', () => {
  nextTurn();
});
