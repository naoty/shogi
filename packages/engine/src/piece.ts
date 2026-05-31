import type { DroppablePieceType, Piece } from "./types";

export const droppablePieceTypes = [
  "pawn",
  "lance",
  "knight",
  "silver",
  "gold",
  "bishop",
  "rook",
] as const satisfies readonly DroppablePieceType[];

export function isPromotable(piece: Piece): boolean {
  return ["rook", "bishop", "silver", "knight", "lance", "pawn"].includes(piece.type);
}
