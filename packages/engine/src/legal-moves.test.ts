import { describe, expect, test } from "vitest";
import { pseudoLegalMovesOf } from "./legal-moves";
import { setupBoard, setupHands } from "./test-data";

describe("pseudoLegalMovesOf", () => {
  describe("歩を進める手を返す", () => {
    test("先手の場合、先手の方向に進める手を返す", () => {
      const board = setupBoard({
        "55": { color: "black", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toEqual([{ type: "normal", from: "55", to: "54", promote: false }]);
    });

    test("後手の場合、後手の方向に進める手を返す", () => {
      const board = setupBoard({
        "55": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "white" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toEqual([{ type: "normal", from: "55", to: "56", promote: false }]);
    });

    test("前に自分の駒がある場合、手を返さない", () => {
      const board = setupBoard({
        "55": { color: "black", type: "pawn" },
        "54": { color: "black", type: "silver" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toEqual([]);
    });

    test("前に相手の駒がある場合、手を返す", () => {
      const board = setupBoard({
        "55": { color: "black", type: "pawn" },
        "54": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toEqual([{ type: "normal", from: "55", to: "54", promote: false }]);
    });

    test("先手の歩が3段目以降に進む場合、成る手も含める", () => {
      const board = setupBoard({
        "54": { color: "black", type: "pawn" },
        "53": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

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
      const result = pseudoLegalMovesOf(position);

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
      const result = pseudoLegalMovesOf(position);

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
      const result = pseudoLegalMovesOf(position);

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
      const result = pseudoLegalMovesOf(position);

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
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "53", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "52", promote: false });
    });

    test("先手の香が3段目以降に進む場合、成る手も含める", () => {
      const board = setupBoard({
        "55": { color: "black", type: "lance" },
        "51": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

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
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "51", promote: true });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "51", promote: false });
    });
  });

  describe("桂を跳ねる手を返す", () => {
    test("先手の場合、先手の方向に跳ねる手を返す", () => {
      const board = setupBoard({
        "77": { color: "black", type: "knight" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "77", to: "65", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "77", to: "85", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "77", to: "89", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "77", to: "59", promote: false });
    });

    test("後手の場合、後手の方向に跳ねる手を返す", () => {
      const board = setupBoard({
        "73": { color: "white", type: "knight" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "white" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "73", to: "85", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "73", to: "65", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "73", to: "81", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "73", to: "51", promote: false });
    });

    test("跳ねる先に自分の駒がある場合、手を返さない", () => {
      const board = setupBoard({
        "77": { color: "black", type: "knight" },
        "65": { color: "black", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).not.toContainEqual({ type: "normal", from: "77", to: "65", promote: false });
    });

    test("跳ねる先に相手の駒がある場合、手を返す", () => {
      const board = setupBoard({
        "77": { color: "black", type: "knight" },
        "65": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "77", to: "65", promote: false });
    });

    test("先手の桂が3段目以降に跳ねる場合、成る手も含める", () => {
      const board = setupBoard({
        "65": { color: "black", type: "knight" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "65", to: "53", promote: true });
      expect(result).toContainEqual({ type: "normal", from: "65", to: "73", promote: true });
    });

    test("先手の桂が2段目以降に跳ねる場合、不成の手を返してはいけない", () => {
      const board = setupBoard({
        "54": { color: "black", type: "knight" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).not.toContainEqual({ type: "normal", from: "54", to: "42", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "54", to: "62", promote: false });
    });
  });
});
