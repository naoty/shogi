import { columnOf, rowOf, squareOf, squares } from "./square";
import type { Board, Color, Move, Position, Square } from "./types";

export function listPseudoLegalMoves(position: Position): Move[] {
  const moves: Move[] = [];

  for (const square of squares) {
    const piece = position.board[square];

    if (piece === null || piece.color !== position.turn) {
      continue;
    }

    switch (piece.type) {
      case "pawn":
        moves.push(...listPseudoLegalPawnMoves(position.board, square));
        break;
      case "lance":
        moves.push(...listPseudoLegalLanceMoves(position.board, square));
        break;
    }
  }

  return moves;
}

function listPseudoLegalPawnMoves(board: Board, square: Square): Move[] {
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

  const toPiece = board[to];
  if (toPiece !== null && toPiece.color === piece.color) {
    return moves;
  }

  if (canMoveWithoutPromotion(piece.color, to)) {
    moves.push({ type: "normal", from: square, to, promote: false });
  }

  if (canPromote(piece.color, square, to)) {
    moves.push({ type: "normal", from: square, to, promote: true });
  }

  return moves;
}

function listPseudoLegalLanceMoves(board: Board, square: Square): Move[] {
  const moves: Move[] = [];

  const piece = board[square];
  if (piece === null || piece.type !== "lance") {
    return moves;
  }

  const fromColumn = columnOf(square);
  const fromRow = rowOf(square);
  const direction = piece.color === "black" ? -1 : 1;
  for (
    let toRow = fromRow + direction;
    1 <= toRow && toRow <= 9;
    toRow += direction
  ) {
    const to = squareOf(fromColumn, toRow);
    if (to === null) {
      break;
    }

    const toPiece = board[to];

    if (toPiece !== null && toPiece.color === piece.color) {
      break;
    }

    if (toPiece !== null && toPiece.color !== piece.color) {
      moves.push({ type: "normal", from: square, to, promote: false });
      break;
    }

    if (canMoveWithoutPromotion(piece.color, to)) {
      moves.push({ type: "normal", from: square, to, promote: false });
    }

    if (canPromote(piece.color, square, to)) {
      moves.push({ type: "normal", from: square, to, promote: true });
    }
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
