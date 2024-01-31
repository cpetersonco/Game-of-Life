type DOMBoard = SVGRectElement[][];

function blankBoard(x: number, y: number): number[][] {
  const board = []
  for (let i = 0; i < x; i++) {
    board.push(new Array(y).fill(0));
  }
  return board;
}

function tick(oldBoard: number[][]): number[][] {
  const board = oldBoard.map(function(arr) {
    return arr.slice();
  });

  board.forEach((row, i) => {
    row.forEach((_, j) => {
      const numOfNeighbors = neighbors(oldBoard, i, j);

      // Any live cell with fewer than two live neighbors dies, as if by underpopulation.
      if (oldBoard[i][j] === 1 && numOfNeighbors < 2) {
        board[i][j] = 0;
        return;
      }

      // Any live cell with two or three live neighbors lives on to the next generation.
      if (oldBoard[i][j] === 1 && (numOfNeighbors === 2 || numOfNeighbors === 3)) {
        return
      }

      // Any live cell with more than three live neighbors dies, as if by overpopulation.
      if (oldBoard[i][j] === 1 && numOfNeighbors > 3) {
        board[i][j] = 0;
        return;
      }

      // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
      if (oldBoard[i][j] === 0 && numOfNeighbors === 3) {
        board[i][j] = 1;
        return;
      }
    })
  })

  return board;
}

function neighbors(board: number[][], x: number, y: number): number {
  const directions = [-1, 0, 1]
  let count = 0;

  directions.forEach((xDirection) => {
    directions.forEach((yDirection) => {
      if (xDirection === 0 && yDirection === 0) {
        return
      }

      const i = x + xDirection;
      const j = y + yDirection;

      if ((i < 0 || i >= board.length) || (j < 0 || j >= board[0].length)) {
        return
      }

      if (board[i][j] === 1) {
        count++;
      }
    })
  })
  return count;
}

let domBoard: DOMBoard = []

function drawBoard(board: number[][]) {
  if (domBoard.length === 0) {
    // initialize empty squares
    const app = document.querySelector("#app");
    app.innerHTML = "";

    const grid = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    grid.setAttribute("width", "1000")
    grid.setAttribute("height", "1000")
    app?.appendChild(grid);

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g")
    grid.appendChild(group)

    for (let i = 0; i < board.length; i++) {
      let row: SVGRectElement[] = []
      for (let j = 0; j < board[0].length; j++) {
        const cell = document.createElementNS("http://www.w3.org/2000/svg", "rect")
        cell.setAttribute("x", `${i * 20}`)
        cell.setAttribute("y", `${j * 20}`)
        cell.setAttribute("width", "20")
        cell.setAttribute("height", "20")
        cell.setAttribute("fill", board[i][j] ? "black" : "white")
        cell.setAttribute("stroke", "grey")
        cell.setAttribute("stroke-width", "1")
        cell.addEventListener("click", () => {
          globalBoard[i][j] = globalBoard[i][j] === 1 ? 0 : 1;
          drawBoard(globalBoard)
        })
        group.appendChild(cell)
        row.push(cell)
      }
      domBoard.push(row)
    }
    return;
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      domBoard[i][j].setAttribute("fill", board[i][j] ? "black" : "white")
    }
  }
}

let globalBoard: number[][] = blankBoard(50, 50)
globalBoard[2][3] = 1;
globalBoard[3][4] = 1;
globalBoard[3][5] = 1;
globalBoard[4][3] = 1;
globalBoard[4][4] = 1;

drawBoard(globalBoard)

let intervalId: number;

const pauseGame = () => {
  clearInterval(intervalId);
  drawBoard(globalBoard)
  console.log(intervalId)
}

const beginGame = () => {
  console.log("Game is afoot!")
  drawBoard(globalBoard)
  intervalId = window.setInterval(() => {
    globalBoard = tick(globalBoard);
    drawBoard(globalBoard)
  }, 500)
}

document.querySelector("#play")?.addEventListener("click", beginGame)
document.querySelector("#pause")?.addEventListener("click", pauseGame)
