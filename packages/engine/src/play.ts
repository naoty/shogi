import { demote, isDroppable, isPromotable, promote } from "./piece";
import type { Color, Drop, Move, Play, Position } from "./types";

export function applyPlay(position: Position, play: Play): Position {
  switch (play.type) {
    case "move":
      return applyMove(position, play);
    case "drop":
      return applyDrop(position, play);
  }
}

function applyMove(position: Position, move: Move): Position {
  const piece = position.board[move.from];
  if (piece === null) {
    throw new Error(`illegal move: no piece at ${move.from}`);
  }
  if (piece.color !== position.turn) {
    throw new Error(`illegal move: piece at ${move.from} is not owned by ${position.turn}`);
  }
  if (move.promote && !isPromotable(piece)) {
    throw new Error(`illegal move: piece at ${move.from} cannot be promoted`);
  }

  const takenPiece = position.board[move.to];
  if (takenPiece !== null && takenPiece.type === "king") {
    throw new Error(`illegal move: cannot take king at ${move.to}`);
  }
  if (takenPiece !== null && takenPiece.color === position.turn) {
    throw new Error(`illegal move: cannot take own piece at ${move.to}`);
  }

  const newBoard = {
    ...position.board,
    [move.from]: null,
    [move.to]: move.promote ? { type: promote(piece.type), color: piece.color } : piece,
  };

  const newHands = { ...position.hands };
  if (takenPiece !== null && takenPiece.color !== position.turn) {
    const demotedType = demote(takenPiece.type);
    if (isDroppable(demotedType)) {
      newHands[position.turn] = {
        ...position.hands[position.turn],
        [demotedType]: position.hands[position.turn][demotedType] + 1,
      };
    }
  }

  return {
    board: newBoard,
    hands: newHands,
    turn: nextTurn(position.turn),
  };
}

function applyDrop(position: Position, drop: Drop): Position {
  const pieceNumber = position.hands[position.turn][drop.piece];
  if (pieceNumber === 0) {
    throw new Error(`illegal drop: no ${drop.piece} in hand`);
  }
  if (position.board[drop.to] !== null) {
    throw new Error(`illegal drop: square ${drop.to} is not empty`);
  }

  const newBoard = {
    ...position.board,
    [drop.to]: { type: drop.piece, color: position.turn },
  };

  const newHands = {
    black: { ...position.hands.black },
    white: { ...position.hands.white },
    [position.turn]: {
      ...position.hands[position.turn],
      [drop.piece]: pieceNumber - 1,
    },
  };

  return {
    ...position,
    board: newBoard,
    hands: newHands,
    turn: nextTurn(position.turn),
  };
}

function nextTurn(color: Color): Color {
  return color === "black" ? "white" : "black";
}
