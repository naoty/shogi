import type { Board, DroppablePieceType, Hand, Hands } from "./types";

export function setupBoard(partialBoard: Partial<Board> = {}): Board {
  const board = {} as Board;

  for (const column of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
    for (const row of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
      board[`${column}${row}`] = partialBoard[`${column}${row}`] ?? null;
    }
  }

  return board;
}

export function setupHands(
  blackHand: Partial<Record<DroppablePieceType, number>> = {},
  whiteHand: Partial<Record<DroppablePieceType, number>> = {},
): Hands {
  return {
    black: setupHand(blackHand),
    white: setupHand(whiteHand),
  };
}

export function setupHand(partialHand: Partial<Record<DroppablePieceType, number>> = {}): Hand {
  return {
    pawn: partialHand.pawn ?? 0,
    lance: partialHand.lance ?? 0,
    knight: partialHand.knight ?? 0,
    silver: partialHand.silver ?? 0,
    gold: partialHand.gold ?? 0,
    bishop: partialHand.bishop ?? 0,
    rook: partialHand.rook ?? 0,
  };
}
