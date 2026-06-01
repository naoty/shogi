import type { Play, Position } from "./types";

export function applyPlay(position: Position, _play: Play): Position {
  return {
    board: position.board,
    hands: position.hands,
    turn: position.turn === "black" ? "white" : "black",
  };
}
