import type { Piece } from "./types";

export function isPromotable(piece: Piece): boolean {
  return ["rook", "bishop", "silver", "knight", "lance", "pawn"].includes(piece.type);
}
