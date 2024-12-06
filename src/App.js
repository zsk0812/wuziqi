import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {Array.from({ length: 10 }).map((_, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {Array.from({ length: 10 }).map((_, colIndex) => {
            const index = rowIndex * 10 + colIndex;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(100).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  // 检查行
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col <= 10 - 5; col++) {
      const startIndex = row * 10 + col;
      const piece = squares[startIndex];
      if (piece) {
        let count = 0;
        for (let i = 0; i < 5; i++) {
          if (squares[startIndex + i] === piece) {
            count++;
          }
        }
        if (count === 5) return piece;
      }
    }
  }
  // 检查列
  for (let col = 0; col < 10; col++) {
    for (let row = 0; row <= 10 - 5; row++) {
      const startIndex = row * 10 + col;
      const piece = squares[startIndex];
      if (piece) {
        let count = 0;
        for (let i = 0; i < 5; i++) {
          if (squares[startIndex + i * 10] === piece) {
            count++;
          }
        }
        if (count === 5) return piece;
      }
    }
  }
  // 检查正对角线
  for (let row = 0; row <= 10 - 5; row++) {
    for (let col = 0; col <= 10 - 5; col++) {
      const startIndex = row * 10 + col;
      const piece = squares[startIndex];
      if (piece) {
        let count = 0;
        for (let i = 0; i < 5; i++) {
          const index = startIndex + i * 11;
          if (squares[index] === piece) {
            count++;
          }
        }
        if (count === 5) return piece;
      }
    }
  }
  // 检查反对角线（右上斜线）
  for (let row = 4; row < 10; row++) {
    for (let col = 0; col <= 10 - 5; col++) {
      const startIndex = row * 10 + col;
      const piece = squares[startIndex];
      if (piece) {
        let count = 0;
        for (let i = 0; i < 5; i++) {
          const index = startIndex - i * 9;
          if (index >= 0 && squares[index] === piece) {
            count++;
          }
        }
        if (count === 5) return piece;
      }
    }
  }
  return null;
}
