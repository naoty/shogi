import type { DroppablePieceType, Piece, PieceType, UnpromotedPieceType } from "./types";

export const droppablePieceTypes = [
  "pawn",
  "lance",
  "knight",
  "silver",
  "gold",
  "bishop",
  "rook",
  "king",
] as const satisfies readonly DroppablePieceType[];

export function isPromotable(piece: Piece): boolean {
  return ["rook", "bishop", "silver", "knight", "lance", "pawn"].includes(piece.type);
}

export function isDroppable(pieceType: string): pieceType is DroppablePieceType {
  return droppablePieceTypes.includes(pieceType as DroppablePieceType);
}

export function promote(pieceType: PieceType): PieceType {
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

export function demote(pieceType: PieceType): UnpromotedPieceType {
  switch (pieceType) {
    case "pawn+":
      return "pawn";
    case "lance+":
      return "lance";
    case "knight+":
      return "knight";
    case "silver+":
      return "silver";
    case "bishop+":
      return "bishop";
    case "rook+":
      return "rook";
    default:
      return pieceType;
  }
}
