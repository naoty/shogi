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
      case "pawn": {
        const forward = piece.color === "black" ? -1 : 1;
        moves.push(...stepMovesOf(position.board, square, [[0, forward]]));
        break;
      }
      case "lance": {
        const forward = piece.color === "black" ? -1 : 1;
        moves.push(...slidingMovesOf(position.board, square, [[0, forward]]));
        break;
      }
      case "knight": {
        const forward = piece.color === "black" ? -2 : 2;
        moves.push(
          ...stepMovesOf(position.board, square, [
            [-1, forward],
            [1, forward],
          ]),
        );
        break;
      }
      case "silver": {
        const forward = piece.color === "black" ? -1 : 1;
        moves.push(
          ...stepMovesOf(position.board, square, [
            [0, forward],
            [-1, forward],
            [1, forward],
            [-1, -forward],
            [1, -forward],
          ]),
        );
        break;
      }
      case "gold":
      case "pawn+":
      case "lance+":
      case "knight+":
      case "silver+": {
        const forward = piece.color === "black" ? -1 : 1;
        moves.push(
          ...stepMovesOf(position.board, square, [
            [0, forward],
            [-1, forward],
            [1, forward],
            [-1, 0],
            [1, 0],
            [0, -forward],
          ]),
        );
        break;
      }
      case "king": {
        moves.push(...stepMovesOf(position.board, square, KING_DIRECTIONS));
        break;
      }
      case "rook": {
        moves.push(...slidingMovesOf(position.board, square, ROOK_DIRECTIONS));
        break;
      }
      case "rook+": {
        moves.push(...stepMovesOf(position.board, square, BISHOP_DIRECTIONS));
        moves.push(...slidingMovesOf(position.board, square, ROOK_DIRECTIONS));
        break;
      }
      case "bishop": {
        moves.push(...slidingMovesOf(position.board, square, BISHOP_DIRECTIONS));
        break;
      }
      case "bishop+": {
        moves.push(...stepMovesOf(position.board, square, ROOK_DIRECTIONS));
        moves.push(...slidingMovesOf(position.board, square, BISHOP_DIRECTIONS));
        break;
      }
    }
  }

  return moves;
}

const ROOK_DIRECTIONS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
] as const;

const BISHOP_DIRECTIONS = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
] as const;

const KING_DIRECTIONS = [...ROOK_DIRECTIONS, ...BISHOP_DIRECTIONS] as const;

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
  if (!isPromotable(piece)) return false;

  const fromRow = rowOf(from);
  const toRow = rowOf(to);

  if (piece.color === "black") {
    return fromRow <= 3 || toRow <= 3;
  } else {
    return fromRow >= 7 || toRow >= 7;
  }
}
