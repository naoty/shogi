import { columnOf, rowOf, squareOf, squares } from "./square";
import type { Board, Move, Piece, Position, Square } from "./types";

export function pseudoLegalMovesOf(position: Position): Move[] {
  const moves: Move[] = [];

  for (const square of squares) {
    const piece = position.board[square];

    if (piece === null || piece.color !== position.turn) {
      continue;
    }

    switch (piece.type) {
      case "pawn":
        moves.push(...pseudoLegalPawnMovesOf(position.board, square));
        break;
      case "lance":
        moves.push(...pseudoLegalLanceMovesOf(position.board, square));
        break;
      case "knight":
        moves.push(...pseudoLegalKnightMovesOf(position.board, square));
        break;
    }
  }

  return moves;
}

function pseudoLegalPawnMovesOf(board: Board, square: Square): Move[] {
  const moves: Move[] = [];

  const piece = board[square];
  if (piece === null || piece.type !== "pawn") {
    return moves;
  }

  const fromColumn = columnOf(square);
  const fromRow = rowOf(square);

  const toRow = piece.color === "black" ? fromRow - 1 : fromRow + 1;
  const to = squareOf(fromColumn, toRow);
  if (to === null) {
    return moves;
  }

  return normalMovesOf(board, square, to);
}

function pseudoLegalLanceMovesOf(board: Board, square: Square): Move[] {
  const moves: Move[] = [];

  const piece = board[square];
  if (piece === null || piece.type !== "lance") {
    return moves;
  }

  const fromColumn = columnOf(square);
  const fromRow = rowOf(square);
  const direction = piece.color === "black" ? -1 : 1;
  for (let toRow = fromRow + direction; 1 <= toRow && toRow <= 9; toRow += direction) {
    const to = squareOf(fromColumn, toRow);
    if (to === null) break;

    moves.push(...normalMovesOf(board, square, to));

    // 駒があればそれ以上進めない
    if (board[to] !== null) break;
  }

  return moves;
}

function pseudoLegalKnightMovesOf(board: Board, square: Square): Move[] {
  const moves: Move[] = [];

  const piece = board[square];
  if (piece === null || piece.type !== "knight") {
    return moves;
  }

  const fromColumn = columnOf(square);
  const fromRow = rowOf(square);
  const direction = piece.color === "black" ? -1 : 1;
  for (const toColumn of [fromColumn - 1, fromColumn + 1]) {
    const toRow = fromRow + 2 * direction;
    const to = squareOf(toColumn, toRow);
    if (to === null) continue;

    moves.push(...normalMovesOf(board, square, to));
  }

  return moves;
}

function normalMovesOf(board: Board, from: Square, to: Square): Move[] {
  const piece = board[from];
  if (piece === null) return [];

  const toPiece = board[to];
  if (toPiece !== null && toPiece.color === piece.color) return [];

  const moves: Move[] = [];

  if (canMoveWithoutPromotion(piece, to)) {
    moves.push({ type: "normal", from, to, promote: false });
  }

  if (canPromote(piece, from, to)) {
    moves.push({ type: "normal", from, to, promote: true });
  }

  return moves;
}

function canMoveWithoutPromotion(piece: Piece, to: Square): boolean {
  const toRow = rowOf(to);

  switch (piece.type) {
    case "pawn":
    case "lance":
      return piece.color === "black" ? toRow > 1 : toRow < 9;
    case "knight":
      return piece.color === "black" ? toRow > 2 : toRow < 8;
    default:
      return true;
  }
}

function canPromote(piece: Piece, from: Square, to: Square): boolean {
  const fromRow = rowOf(from);
  const toRow = rowOf(to);

  if (piece.color === "black") {
    return fromRow <= 3 || toRow <= 3;
  } else {
    return fromRow >= 7 || toRow >= 7;
  }
}
