import { slidingMovesOf, steppingMovesOf } from "./legal-plays";
import { squares } from "./square";
import type { Color, Position, Square } from "./types";

export function isCheck(position: Position): boolean {
  const kingSquare = kingSquareOf(position, position.turn);

  for (const square of squares) {
    const piece = position.board[square];

    if (piece === null || piece.color === position.turn) continue;

    switch (piece.type) {
      case "pawn": {
        const forward = piece.color === "black" ? -1 : 1;
        const moves = steppingMovesOf(position.board, square, [[0, forward]]);
        if (moves.some((move) => move.to === kingSquare)) return true;
        break;
      }
      case "lance": {
        const forward = piece.color === "black" ? -1 : 1;
        const moves = slidingMovesOf(position.board, square, [[0, forward]]);
        if (moves.some((move) => move.to === kingSquare)) return true;
        break;
      }
      case "knight": {
        const forward = piece.color === "black" ? -2 : 2;
        const moves = steppingMovesOf(position.board, square, [
          [-1, forward],
          [1, forward],
        ]);
        if (moves.some((move) => move.to === kingSquare)) return true;
        break;
      }
      case "silver": {
        const forward = piece.color === "black" ? -1 : 1;
        const moves = steppingMovesOf(position.board, square, [
          [0, forward],
          [-1, forward],
          [1, forward],
          [-1, -forward],
          [1, -forward],
        ]);
        if (moves.some((move) => move.to === kingSquare)) return true;
        break;
      }
      case "gold":
      case "pawn+":
      case "lance+":
      case "knight+":
      case "silver+": {
        const forward = piece.color === "black" ? -1 : 1;
        const moves = steppingMovesOf(position.board, square, [
          [0, forward],
          [-1, forward],
          [1, forward],
          [-1, 0],
          [1, 0],
          [0, -forward],
        ]);
        if (moves.some((move) => move.to === kingSquare)) return true;
        break;
      }
      case "bishop": {
        const moves = slidingMovesOf(position.board, square, [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ]);
        if (moves.some((move) => move.to === kingSquare)) return true;
        break;
      }
      case "rook": {
        const moves = slidingMovesOf(position.board, square, [
          [0, 1],
          [0, -1],
          [-1, 0],
          [1, 0],
        ]);
        if (moves.some((move) => move.to === kingSquare)) return true;
        break;
      }
      case "rook+": {
        const moves = [
          ...slidingMovesOf(position.board, square, [
            [0, 1],
            [0, -1],
            [-1, 0],
            [1, 0],
          ]),
          ...steppingMovesOf(position.board, square, [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
          ]),
        ];
        if (moves.some((move) => move.to === kingSquare)) return true;
        break;
      }
      case "bishop+": {
        const moves = [
          ...slidingMovesOf(position.board, square, [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
          ]),
          ...steppingMovesOf(position.board, square, [
            [0, 1],
            [0, -1],
            [-1, 0],
            [1, 0],
          ]),
        ];
        if (moves.some((move) => move.to === kingSquare)) return true;
        break;
      }
    }
  }

  return false;
}

function kingSquareOf(position: Position, color: Color): Square {
  for (const square of squares) {
    const piece = position.board[square];
    if (piece !== null && piece.color === color && piece.type === "king") {
      return square;
    }
  }

  throw new Error(`invalid position: no king of color ${color}`);
}
