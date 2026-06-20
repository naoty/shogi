import { isCheck, isCheckmate } from "./check";
import { droppablePieceTypes, isPromotable } from "./piece";
import { applyPlay } from "./play";
import { columnOf, rowOf, squareOf, squares } from "./square";
import type { Board, Color, Drop, Move, Piece, Play, Position, Square } from "./types";

export function legalPlaysOf(position: Position, turn: Color = position.turn): Play[] {
  return pseudoLegalPlaysOf(position, turn).filter((play) => {
    const next = applyPlay(position, play);

    // 打ち歩詰めの禁止
    if (play.type === "drop" && play.piece === "pawn" && isCheckmate(next)) {
      return false;
    }

    return !isCheck(next, turn);
  });
}

export function pseudoLegalPlaysOf(position: Position, turn: Color = position.turn): Play[] {
  const plays: Play[] = [];

  for (const square of squares) {
    const piece = position.board[square];

    if (piece === null) {
      plays.push(...dropsOf(position, square));
      continue;
    }

    if (piece.color !== turn) continue;

    switch (piece.type) {
      case "pawn": {
        const forward = piece.color === "black" ? -1 : 1;
        plays.push(...steppingMovesOf(position.board, square, [[0, forward]]));
        break;
      }
      case "lance": {
        const forward = piece.color === "black" ? -1 : 1;
        plays.push(...slidingMovesOf(position.board, square, [[0, forward]]));
        break;
      }
      case "knight": {
        const forward = piece.color === "black" ? -2 : 2;
        plays.push(
          ...steppingMovesOf(position.board, square, [
            [-1, forward],
            [1, forward],
          ]),
        );
        break;
      }
      case "silver": {
        const forward = piece.color === "black" ? -1 : 1;
        plays.push(
          ...steppingMovesOf(position.board, square, [
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
        plays.push(
          ...steppingMovesOf(position.board, square, [
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
        plays.push(...steppingMovesOf(position.board, square, KING_DIRECTIONS));
        break;
      }
      case "rook": {
        plays.push(...slidingMovesOf(position.board, square, ROOK_DIRECTIONS));
        break;
      }
      case "rook+": {
        plays.push(...steppingMovesOf(position.board, square, BISHOP_DIRECTIONS));
        plays.push(...slidingMovesOf(position.board, square, ROOK_DIRECTIONS));
        break;
      }
      case "bishop": {
        plays.push(...slidingMovesOf(position.board, square, BISHOP_DIRECTIONS));
        break;
      }
      case "bishop+": {
        plays.push(...steppingMovesOf(position.board, square, ROOK_DIRECTIONS));
        plays.push(...slidingMovesOf(position.board, square, BISHOP_DIRECTIONS));
        break;
      }
    }
  }

  return plays;
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

function steppingMovesOf(board: Board, from: Square, directions: readonly Direction[]): Move[] {
  const moves: Move[] = [];

  const fromColumn = columnOf(from);
  const fromRow = rowOf(from);

  for (const [columnDirection, rowDirection] of directions) {
    const toColumn = fromColumn + columnDirection;
    const toRow = fromRow + rowDirection;
    const to = squareOf(toColumn, toRow);
    if (to === null) continue;

    moves.push(...movesOf(board, from, to));
  }

  return moves;
}

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

      moves.push(...movesOf(board, from, to));

      // 駒があればそれ以上進めない
      if (board[to] !== null) break;
    }
  }

  return moves;
}

function movesOf(board: Board, from: Square, to: Square): Move[] {
  const piece = board[from];
  if (piece === null) return [];

  const toPiece = board[to];
  if (toPiece !== null && toPiece.color === piece.color) return [];
  if (toPiece !== null && toPiece.type === "king") return [];

  const moves: Move[] = [];

  if (canMoveWithoutPromotion(piece, to)) {
    moves.push({ type: "move", from, to, promote: false });
  }

  if (canPromote(piece, from, to)) {
    moves.push({ type: "move", from, to, promote: true });
  }

  return moves;
}

function dropsOf(position: Position, to: Square): Drop[] {
  const drops: Drop[] = [];
  const hand = position.hands[position.turn];

  for (const pieceType of droppablePieceTypes) {
    const droppedPiece = { color: position.turn, type: pieceType } as Piece;

    if (hand[pieceType] === 0) continue;
    if (!canMoveWithoutPromotion(droppedPiece, to)) continue;

    if (pieceType === "pawn" && hasUnpromotedPawnInColumn(position.board, position.turn, columnOf(to))) {
      continue;
    }

    drops.push({ type: "drop", piece: pieceType, to });
  }

  return drops;
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

function hasUnpromotedPawnInColumn(board: Board, color: Color, column: number): boolean {
  return squares.some((square) => {
    const piece = board[square];
    return columnOf(square) === column && piece !== null && piece.color === color && piece.type === "pawn";
  });
}
