import type { Board } from "./types";

export function boardWith(partialBoard: Partial<Board> = {}): Board {
  const board = {} as Board;

  for (const column of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
    for (const row of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
      board[`${column}${row}`] = partialBoard[`${column}${row}`] ?? null;
    }
  }

  return board;
}

export const initialBoard = boardWith({
  "11": { color: "white", type: "lance" },
  "21": { color: "white", type: "knight" },
  "31": { color: "white", type: "silver" },
  "41": { color: "white", type: "gold" },
  "51": { color: "white", type: "king" },
  "61": { color: "white", type: "gold" },
  "71": { color: "white", type: "silver" },
  "81": { color: "white", type: "knight" },
  "91": { color: "white", type: "lance" },
  "22": { color: "white", type: "bishop" },
  "82": { color: "white", type: "rook" },
  "13": { color: "white", type: "pawn" },
  "23": { color: "white", type: "pawn" },
  "33": { color: "white", type: "pawn" },
  "43": { color: "white", type: "pawn" },
  "53": { color: "white", type: "pawn" },
  "63": { color: "white", type: "pawn" },
  "73": { color: "white", type: "pawn" },
  "83": { color: "white", type: "pawn" },
  "93": { color: "white", type: "pawn" },
  "19": { color: "black", type: "lance" },
  "29": { color: "black", type: "knight" },
  "39": { color: "black", type: "silver" },
  "49": { color: "black", type: "gold" },
  "59": { color: "black", type: "king" },
  "69": { color: "black", type: "gold" },
  "79": { color: "black", type: "silver" },
  "89": { color: "black", type: "knight" },
  "99": { color: "black", type: "lance" },
  "28": { color: "black", type: "rook" },
  "88": { color: "black", type: "bishop" },
  "17": { color: "black", type: "pawn" },
  "27": { color: "black", type: "pawn" },
  "37": { color: "black", type: "pawn" },
  "47": { color: "black", type: "pawn" },
  "57": { color: "black", type: "pawn" },
  "67": { color: "black", type: "pawn" },
  "77": { color: "black", type: "pawn" },
  "87": { color: "black", type: "pawn" },
  "97": { color: "black", type: "pawn" },
});
