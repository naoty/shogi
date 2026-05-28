import { describe, expect, test } from "vitest";
import { listPseudoLegalMoves } from "./legal-moves";
import { setupBoard, setupHands } from "./test-data";

describe("listPseudoLegalMoves", () => {
  describe("歩を進める手を返す", () => {
    test("先手の場合、先手の方向に進める手を返す", () => {
      const board = setupBoard({
        "55": { color: "black", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = listPseudoLegalMoves(position);

      expect(result).toEqual([{ type: "normal", from: "55", to: "54", promote: false }]);
    });

    test("後手の場合、後手の方向に進める手を返す", () => {
      const board = setupBoard({
        "55": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "white" as const };
      const result = listPseudoLegalMoves(position);

      expect(result).toEqual([{ type: "normal", from: "55", to: "56", promote: false }]);
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

      expect(result).toEqual([{ type: "normal", from: "55", to: "54", promote: false }]);
    });

    test("先手の歩が3段目以降に進む場合、成る手も含める", () => {
      const board = setupBoard({
        "54": { color: "black", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = listPseudoLegalMoves(position);

      expect(result).toEqual([
        { type: "normal", from: "54", to: "53", promote: false },
        { type: "normal", from: "54", to: "53", promote: true },
      ]);
    });

    test("最奥に進む場合、不成を返してはいけない", () => {
      const board = setupBoard({
        "52": { color: "black", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = listPseudoLegalMoves(position);

      expect(result).toEqual([{ type: "normal", from: "52", to: "51", promote: true }]);
    });
  });

  describe("香を進める手を返す", () => {
    test("先手の場合、先手の方向に進める手を返す", () => {
      const board = setupBoard({
        "55": { color: "black", type: "lance" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = listPseudoLegalMoves(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "53", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "52", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "56", promote: false });
    });

    test("後手の場合、後手の方向に進める手を返す", () => {
      const board = setupBoard({
        "55": { color: "white", type: "lance" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "white" as const };
      const result = listPseudoLegalMoves(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "56", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "57", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "58", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
    });

    test("前に自分の駒がある場合、その手前までの手を返す", () => {
      const board = setupBoard({
        "59": { color: "black", type: "lance" },
        "55": { color: "black", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = listPseudoLegalMoves(position);

      expect(result).toContainEqual({ type: "normal", from: "59", to: "58", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "59", to: "57", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "59", to: "56", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "59", to: "55", promote: false });
    });

    test("前に相手の駒がある場合、その駒を取る手までを返す", () => {
      const board = setupBoard({
        "55": { color: "black", type: "lance" },
        "53": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = listPseudoLegalMoves(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "53", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "52", promote: false });
    });

    test("先手の香が3段目以降に進む場合、成る手も含める", () => {
      const board = setupBoard({
        "55": { color: "black", type: "lance" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = listPseudoLegalMoves(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "53", promote: true });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "52", promote: true });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "51", promote: true });
    });

    test("最奥に進む場合、不成を返してはいけない", () => {
      const board = setupBoard({
        "55": { color: "black", type: "lance" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = listPseudoLegalMoves(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "51", promote: true });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "51", promote: false });
    });
  });
});
