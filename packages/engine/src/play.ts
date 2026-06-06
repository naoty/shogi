import type { PieceType, Play, Position } from "./types";

export function applyPlay(position: Position, play: Play): Position {
  switch (play.type) {
    case "move": {
      const piece = position.board[play.from];
      if (piece === null) {
        throw new Error(`illegal play: no piece at ${play.from}`);
      }

      const newBoard = {
        ...position.board,
        [play.from]: null,
        [play.to]: play.promote ? { type: promote(piece.type), color: piece.color } : piece,
      };

      return {
        ...position,
        board: newBoard,
        turn: position.turn === "black" ? "white" : "black",
      };
    }
    default: {
      return {
        ...position,
        turn: position.turn === "black" ? "white" : "black",
      };
    }
  }
}

function promote(pieceType: PieceType): PieceType {
  switch (pieceType) {
    case "pawn":
      return "pawn+";
    case "lance":
      return "lance+";
    case "knight":
      return "knight+";
    case "silver":
      return "silver+";
    case "bishop":
      return "bishop+";
    case "rook":
      return "rook+";
    default:
      return pieceType;
  }
}
