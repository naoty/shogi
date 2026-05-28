import { columnOf, rowOf, squareOf, squares } from "./square";
import type { Board, Color, Move, Position, Square } from "./types";

export function pseudoLegalMoves(position: Position): Move[] {
  const moves: Move[] = [];

  for (const square of squares) {
    const piece = position.board[square];

    if (piece === null || piece.color !== position.turn) {
      continue;
    }

    switch (piece.type) {
      case "pawn":
        moves.push(...pseudoLegalPawnMoves(position.board, square));
        break;
      case "lance":
        moves.push(...pseudoLegalLanceMoves(position.board, square));
        break;
    }
  }

  return moves;
}

function pseudoLegalPawnMoves(board: Board, square: Square): Move[] {
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

function pseudoLegalLanceMoves(board: Board, square: Square): Move[] {
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

function normalMovesOf(board: Board, from: Square, to: Square): Move[] {
  const piece = board[from];
  if (piece === null) return [];

  const toPiece = board[to];
  if (toPiece !== null && toPiece.color === piece.color) return [];

  const moves: Move[] = [];

  if (canMoveWithoutPromotion(piece.color, to)) {
    moves.push({ type: "normal", from, to, promote: false });
  }

  if (canPromote(piece.color, from, to)) {
    moves.push({ type: "normal", from, to, promote: true });
  }

  return moves;
}

function canMoveWithoutPromotion(color: Color, to: Square): boolean {
  const toRow = rowOf(to);

  if (color === "black") {
    return toRow > 1;
  } else {
    return toRow < 9;
  }
}

function canPromote(color: Color, from: Square, to: Square): boolean {
  const fromRow = rowOf(from);
  const toRow = rowOf(to);

  if (color === "black") {
    return fromRow <= 3 || toRow <= 3;
  } else {
    return fromRow >= 7 || toRow >= 7;
  }
}
