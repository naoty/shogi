import { demote, isPromotable, promote } from "./piece";
import type { Play, Position } from "./types";

export function applyPlay(position: Position, play: Play): Position {
  switch (play.type) {
    case "move": {
      const piece = position.board[play.from];
      if (piece === null) {
        throw new Error(`illegal play: no piece at ${play.from}`);
      }
      if (piece.color !== position.turn) {
        throw new Error(`illegal play: piece at ${play.from} is not owned by ${position.turn}`);
      }
      if (play.promote && !isPromotable(piece)) {
        throw new Error(`illegal play: piece at ${play.from} cannot be promoted`);
      }

      const newBoard = {
        ...position.board,
        [play.from]: null,
        [play.to]: play.promote ? { type: promote(piece.type), color: piece.color } : piece,
      };

      const newHands = { ...position.hands };
      const takenPiece = position.board[play.to];
      if (takenPiece !== null && takenPiece.color !== position.turn) {
        const demotedType = demote(takenPiece.type);
        newHands[position.turn] = {
          ...position.hands[position.turn],
          [demotedType]: position.hands[position.turn][demotedType] + 1,
        };
      }
      if (takenPiece !== null && takenPiece.color === position.turn) {
        throw new Error(`illegal play: cannot take own piece at ${play.to}`);
      }

      return {
        board: newBoard,
        hands: newHands,
        turn: position.turn === "black" ? "white" : "black",
      };
    }
    case "drop": {
      const pieceNumber = position.hands[position.turn][play.piece];
      if (pieceNumber === 0) {
        throw new Error(`illegal play: no ${play.piece} in hand`);
      }
      if (position.board[play.to] !== null) {
        throw new Error(`illegal play: square ${play.to} is not empty`);
      }

      const newBoard = {
        ...position.board,
        [play.to]: { type: play.piece, color: position.turn },
      };

      const newHands = {
        black: { ...position.hands.black },
        white: { ...position.hands.white },
        [position.turn]: {
          ...position.hands[position.turn],
          [play.piece]: pieceNumber - 1,
        },
      };

      return {
        ...position,
        board: newBoard,
        hands: newHands,
        turn: position.turn === "black" ? "white" : "black",
      };
    }
  }
}
