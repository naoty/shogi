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
      case "pawn+":
      case "lance+":
      case "knight+":
      case "silver+":
        moves.push(...pseudoLegalGoldMovesOf(position.board, square));
        break;
      case "king":
        moves.push(...pseudoLegalKingMovesOf(position.board, square));
        break;
      case "rook":
        moves.push(...pseudoLegalRookMovesOf(position.board, square));
        break;
      case "rook+":
        moves.push(...pseudoLegalPromotedRookMovesOf(position.board, square));
        break;
      case "bishop":
        moves.push(...pseudoLegalBishopMovesOf(position.board, square));
        break;
    }
  }

  return moves;
}

function pseudoLegalPawnMovesOf(board: Board, square: Square): Move[] {
  const piece = board[square];
  if (piece === null || piece.type !== "pawn") {
    return [];
  }

  const forward = piece.color === "black" ? -1 : 1;
  const directions = [[0, forward]] as const;

  return stepMovesOf(board, square, directions);
}

function pseudoLegalLanceMovesOf(board: Board, square: Square): Move[] {
  const piece = board[square];
  if (piece === null || piece.type !== "lance") {
    return [];
  }

  const forward = piece.color === "black" ? -1 : 1;
  const directions = [[0, forward]] as const;

  return slidingMovesOf(board, square, directions);
}

function pseudoLegalKnightMovesOf(board: Board, square: Square): Move[] {
  const piece = board[square];
  if (piece === null || piece.type !== "knight") {
    return [];
  }

  const forward = piece.color === "black" ? -2 : 2;
  const directions = [
    [-1, forward],
    [1, forward],
  ] as const;

  return stepMovesOf(board, square, directions);
}

function pseudoLegalSilverMovesOf(board: Board, square: Square): Move[] {
  const piece = board[square];
  if (piece === null || piece.type !== "silver") {
    return [];
  }

  const forward = piece.color === "black" ? -1 : 1;
  const directions = [
    [0, forward],
    [-1, forward],
    [1, forward],
    [-1, -forward],
    [1, -forward],
  ] as const;

  return stepMovesOf(board, square, directions);
}

function pseudoLegalGoldMovesOf(board: Board, square: Square): Move[] {
  const piece = board[square];
  if (piece === null) return [];

  const forward = piece.color === "black" ? -1 : 1;
  const directions = [
    [0, forward],
    [-1, forward],
    [1, forward],
    [-1, 0],
    [1, 0],
    [0, -forward],
  ] as const;

  return stepMovesOf(board, square, directions);
}

function pseudoLegalKingMovesOf(board: Board, square: Square): Move[] {
  const piece = board[square];
  if (piece === null || piece.type !== "king") {
    return [];
  }

  const directions = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ] as const;

  return stepMovesOf(board, square, directions);
}

function pseudoLegalRookMovesOf(board: Board, square: Square): Move[] {
  const piece = board[square];
  if (piece === null) return [];

  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ] as const;

  return slidingMovesOf(board, square, directions);
}

function pseudoLegalPromotedRookMovesOf(board: Board, square: Square): Move[] {
  const piece = board[square];
  if (piece === null) return [];

  const directions = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ] as const;

  return [...stepMovesOf(board, square, directions), ...pseudoLegalRookMovesOf(board, square)];
}

function pseudoLegalBishopMovesOf(board: Board, square: Square): Move[] {
  const piece = board[square];
  if (piece === null || piece.type !== "bishop") {
    return [];
  }

  const directions = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ] as const;

  return slidingMovesOf(board, square, directions);
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

function stepMovesOf(board: Board, from: Square, directions: readonly Direction[]): Move[] {
  const moves: Move[] = [];

  const fromColumn = columnOf(from);
  const fromRow = rowOf(from);

  for (const [columnDirection, rowDirection] of directions) {
    const toColumn = fromColumn + columnDirection;
    const toRow = fromRow + rowDirection;
    const to = squareOf(toColumn, toRow);
    if (to === null) continue;

    moves.push(...normalMovesOf(board, from, to));
  }

  return moves;
}

function slidingMovesOf(board: Board, from: Square, directions: readonly Direction[]): Move[] {
  const moves: Move[] = [];

  const fromColumn = columnOf(from);
  const fromRow = rowOf(from);

  for (const [columnDirection, rowDirection] of directions) {
    for (let forward = 1; forward <= 8; forward++) {
      const toColumn = fromColumn + columnDirection * forward;
      const toRow = fromRow + rowDirection * forward;
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
