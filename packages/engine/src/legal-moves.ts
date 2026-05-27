import { columnOf, rowOf, squareOf, squares } from "./square";
import type { Move, Position } from "./types";

export function listPseudoLegalMoves(position: Position): Move[] {
  const moves: Move[] = [];

  for (const square of squares) {
    const piece = position.board[square];

    if (piece === null || piece.color !== position.turn) {
      continue;
    }

    if (piece.type === "pawn") {
      const fromColumn = columnOf(square);
      const fromRow = rowOf(square);

      const toRow = piece.color === "black" ? fromRow - 1 : fromRow + 1;
      const to = squareOf(fromColumn, toRow);

      if (to === null) {
        continue;
      }

      const toPiece = position.board[to];

      if (toPiece !== null && toPiece.color === piece.color) {
        continue;
      }

      if (
        (piece.color === "black" && toRow > 1) ||
        (piece.color === "white" && toRow < 9)
      ) {
        moves.push({
          type: "normal",
          from: square,
          to,
          promote: false,
        });
      }

      if (piece.color === "black" && toRow <= 3) {
        moves.push({
          type: "normal",
          from: square,
          to,
          promote: true,
        });
      }

      if (piece.color === "white" && toRow >= 7) {
        moves.push({
          type: "normal",
          from: square,
          to,
          promote: true,
        });
      }
    }
  }

  return moves;
}
