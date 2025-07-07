function checkWinner(board, row, col, symbol) {
  return (
    checkDirection(board, row, col, symbol, 0, 1) || // horizontal
    checkDirection(board, row, col, symbol, 1, 0) || // vertical
    checkDirection(board, row, col, symbol, 1, 1) || // diagonal right-down
    checkDirection(board, row, col, symbol, 1, -1)   // diagonal left-down
  );
}

function checkDirection(board, row, col, symbol, dr, dc) {
  let count = 1;

  count += countInDirection(board, row, col, symbol, dr, dc);
  count += countInDirection(board, row, col, symbol, -dr, -dc);

  return count >= 4;
}

function countInDirection(board, row, col, symbol, dr, dc) {
  let r = row + dr;
  let c = col + dc;
  let count = 0;

  while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === symbol) {
    count++;
    r += dr;
    c += dc;
  }

  return count;
}

module.exports = { checkWinner };
