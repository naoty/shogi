import { describe, expect, test } from "vitest";
import { listPseudoLegalMoves } from "./legal-moves";
import { setupBoard, setupHands } from "./test-data";

describe("listPseudoLegalMoves", () => {
  describe("歩を前に進める手を返す", () => {
    test("先手の場合、先手の方向に進める手を返す", () => {
      const board = setupBoard({
        "55": { color: "black", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = listPseudoLegalMoves(position);
      expect(result).toEqual([
        {
          type: "normal",
          from: "55",
          to: "54",
          promote: false,
        },
      ]);
    });

    test("後手の場合、後手の方向に進める手を返す", () => {
      const board = setupBoard({
        "55": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "white" as const };
      const result = listPseudoLegalMoves(position);
      expect(result).toEqual([
        {
          type: "normal",
          from: "55",
          to: "56",
          promote: false,
        },
      ]);
    });

    test("これ以上前に進めない場合、手を返さない", () => {
      const board = setupBoard({
        "51": { color: "black", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = listPseudoLegalMoves(position);
      expect(result).toEqual([]);
    });

    test("前に自分の駒がある場合、手を返さない", () => {
      const board = setupBoard({
        "55": { color: "black", type: "pawn" },
        "54": { color: "black", type: "silver" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = listPseudoLegalMoves(position);
      expect(result).toEqual([]);
    });

    test("前に相手の駒がある場合、手を返す", () => {
      const board = setupBoard({
        "55": { color: "black", type: "pawn" },
        "54": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = listPseudoLegalMoves(position);
      expect(result).toEqual([
        {
          type: "normal",
          from: "55",
          to: "54",
          promote: false,
        },
      ]);
    });
  });
});
