const gameBoardElement = document.querySelector('.game-board');
const startButtonElement = document.querySelector('.start-button');
const statusElement = document.querySelector('.status');
const boardSizeButton = document.querySelector('.board-size-button');

let gameBoardContent = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

let currentPlayer = 'x';
let winner = '';
let isBoardFull = false;

const resetGameBoard = () => {
  if (gameBoardContent.length === 3) {
    gameBoardContent = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
  } else {
    gameBoardContent = [
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
    ];
  }
  currentPlayer = 'x';
  winner = '';
};

const getAvailableCells = () => {
  let availableCells = [];
  for (let row = 0; row < gameBoardContent.length; row++) {
    for (let col = 0; col < gameBoardContent[row].length; col++) {
      if (!gameBoardContent[row][col]) {
        availableCells.push({ row: row, col: col });
      }
    }
  }
  return availableCells;
};

const isGameOver = () => {
  let isFull = true;
  for (let row = 0; row < gameBoardContent.length; row++) {
    for (let col = 0; col < gameBoardContent[row].length; col++) {
      if (!gameBoardContent[row][col]) {
        isFull = false;
      }
    }
  }
  isBoardFull = isFull;
};

const isWinnerFound = () => {
  const nbOfCellsToWin = gameBoardContent.length === 10 ? 5 : 3;

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

  if (winner) {
    return winner;
  }
  return null;
};

const setCurrentPlayerStatus = (modelName, duration) => {
  statusElement.classList.remove('o-playing', 'x-playing');
  statusElement.classList.add(`${currentPlayer}-playing`);
  statusElement.innerHTML = `<strong>${modelName}</strong> vient de jouer en ${duration} seconde(s), c'est maintenant au tour ${currentPlayer === 'x' ? 'de la <span>croix</span>' : 'du <span>cercle</span>'}.`;
};

const toggleCurrentPlayer = (modelName, duration) => {
  if (currentPlayer === 'x') {
    currentPlayer = 'o';
    setCurrentPlayerStatus(modelName, duration);
    return;
  }
  if (currentPlayer === 'o') {
    currentPlayer = 'x';
    setCurrentPlayerStatus(modelName, duration);
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

const toggleGameBoardSize = () => {
  if (gameBoardContent.length === 3) {
    gameBoardContent = [
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
    ];
    gameBoardElement.classList.add('ten-by-ten');
    boardSizeButton.innerHTML = 'Jouer en 3x3';
  } else {
    gameBoardContent = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    gameBoardElement.classList.remove('ten-by-ten');
    boardSizeButton.innerHTML = 'Jouer en 10x10';
  }
  showGameBoard();
};

const nextTurn = async () => {
  showGameBoard();
  startTime = new Date();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        board: gameBoardContent,
        turn: currentPlayer,
        available_cells: getAvailableCells(),
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    gameBoardContent[data.move.row][data.move.col] = currentPlayer;
    fetchedData = data;

    showGameBoard();
    isWinnerFound();
    isGameOver();
    endTime = new Date();
    turnDuration = (endTime - startTime) / 1000;

    if (!winner && !isBoardFull) {
      startButtonElement.innerHTML = 'Tour suivant';
      toggleCurrentPlayer(data.model_used, turnDuration);
    } else {
      startButtonElement.innerHTML = 'Nouvelle partie';
      if (winner) {
        statusElement.innerHTML = `Le modèle gagnant est : <strong>${data.model_used}</strong> avec ${currentPlayer === 'x' ? '<span>la croix</span>' : '<span>le cercle</span>'} après un dernier tour ayant duré ${turnDuration} seconde(s).`;
      } else {
        statusElement.innerHTML = `La partie s'est terminée par une <strong>égalité</strong> après un dernier tour ayant duré ${turnDuration} seconde(s).`;
      }
    }
  } catch (error) {
    console.error('api call failed', error);
  }
};

boardSizeButton.addEventListener('click', (e) => {
  e.preventDefault();
  toggleGameBoardSize();
});

startButtonElement.addEventListener('click', (e) => {
  e.preventDefault();
  if (winner) {
    resetGameBoard();
  }
  nextTurn();
});

window.addEventListener('load', () => {
  showGameBoard();
});
