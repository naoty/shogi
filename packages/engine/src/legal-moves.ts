import { isPromotable } from "./piece";
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
      case "silver":
        moves.push(...pseudoLegalSilverMovesOf(position.board, square));
        break;
      case "gold":
        moves.push(...pseudoLegalGoldMovesOf(position.board, square));
        break;
      case "king":
        moves.push(...pseudoLegalKingMovesOf(position.board, square));
        break;
      case "rook":
        moves.push(...pseudoLegalRookMovesOf(position.board, square));
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

  const directions = piece.color === "black" ? [[0, -1] as const] : [[0, 1] as const];
  moves.push(...slidingMovesOf(board, square, directions));

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

function pseudoLegalSilverMovesOf(board: Board, square: Square): Move[] {
  const moves: Move[] = [];

  const piece = board[square];
  if (piece === null || piece.type !== "silver") {
    return moves;
  }

  const fromColumn = columnOf(square);
  const fromRow = rowOf(square);
  const direction = piece.color === "black" ? -1 : 1;
  const vectors = [
    [0, direction],
    [-1, direction],
    [1, direction],
    [-1, -direction],
    [1, -direction],
  ] as const;
  for (const vector of vectors) {
    const toColumn = fromColumn + vector[0];
    const toRow = fromRow + vector[1];
    const to = squareOf(toColumn, toRow);
    if (to === null) continue;

    moves.push(...normalMovesOf(board, square, to));
  }

  return moves;
}

function pseudoLegalGoldMovesOf(board: Board, square: Square): Move[] {
  const moves: Move[] = [];

  const piece = board[square];
  if (piece === null || piece.type !== "gold") {
    return moves;
  }

  const fromColumn = columnOf(square);
  const fromRow = rowOf(square);
  const direction = piece.color === "black" ? -1 : 1;
  const vectors = [
    [0, direction],
    [-1, direction],
    [1, direction],
    [-1, 0],
    [1, 0],
    [0, -direction],
  ] as const;
  for (const vector of vectors) {
    const toColumn = fromColumn + vector[0];
    const toRow = fromRow + vector[1];
    const to = squareOf(toColumn, toRow);
    if (to === null) continue;

    moves.push(...normalMovesOf(board, square, to));
  }

  return moves;
}

function pseudoLegalKingMovesOf(board: Board, square: Square): Move[] {
  const moves: Move[] = [];

  const piece = board[square];
  if (piece === null || piece.type !== "king") {
    return moves;
  }

  const fromColumn = columnOf(square);
  const fromRow = rowOf(square);
  const vectors = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ] as const;
  for (const vector of vectors) {
    const toColumn = fromColumn + vector[0];
    const toRow = fromRow + vector[1];
    const to = squareOf(toColumn, toRow);
    if (to === null) continue;

    moves.push(...normalMovesOf(board, square, to));
  }

  return moves;
}

function pseudoLegalRookMovesOf(board: Board, square: Square): Move[] {
  const moves: Move[] = [];

  const piece = board[square];
  if (piece === null || piece.type !== "rook") {
    return moves;
  }

  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ] as const;
  moves.push(...slidingMovesOf(board, square, directions));

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

type Direction = readonly [number, number];
function slidingMovesOf(board: Board, from: Square, directions: readonly Direction[]): Move[] {
  const moves: Move[] = [];

  const fromColumn = columnOf(from);
  const fromRow = rowOf(from);

  for (const [columnDirection, rowDirection] of directions) {
    for (let distance = 1; distance <= 8; distance++) {
      const toColumn = fromColumn + columnDirection * distance;
      const toRow = fromRow + rowDirection * distance;
      const to = squareOf(toColumn, toRow);
      if (to === null) break;

      moves.push(...normalMovesOf(board, from, to));

      // 駒があればそれ以上進めない
      if (board[to] !== null) break;
    }
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
  if (!isPromotable(piece)) return false;

  const fromRow = rowOf(from);
  const toRow = rowOf(to);

  if (piece.color === "black") {
    return fromRow <= 3 || toRow <= 3;
  } else {
    return fromRow >= 7 || toRow >= 7;
  }
}
