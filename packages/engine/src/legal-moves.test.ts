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

      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
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

  describe("銀を動かす手を返す", () => {
    test("先手の場合、先手の方向に動かす手を返す", () => {
      const board = setupBoard({
        "55": { color: "black", type: "silver" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "44", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "64", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "46", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "66", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "45", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "65", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "56", promote: false });
    });

    test("後手の場合、後手の方向に動かす手を返す", () => {
      const board = setupBoard({
        "55": { color: "white", type: "silver" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "white" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "56", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "46", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "66", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "44", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "64", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "45", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "65", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
    });

    test("動かす先に自分の駒がある場合、手を返さない", () => {
      const board = setupBoard({
        "55": { color: "black", type: "silver" },
        "54": { color: "black", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
    });

    test("動かす先に相手の駒がある場合、手を返す", () => {
      const board = setupBoard({
        "55": { color: "black", type: "silver" },
        "54": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
    });

    test("先手の銀が3段目以降に動く場合、成る手も含める", () => {
      const board = setupBoard({
        "54": { color: "black", type: "silver" },
        "53": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "54", to: "53", promote: true });
      expect(result).toContainEqual({ type: "normal", from: "54", to: "43", promote: true });
      expect(result).toContainEqual({ type: "normal", from: "54", to: "63", promote: true });
    });

    test("先手の銀が3段目から4段目に動く場合、成る手を含める", () => {
      const board = setupBoard({
        "53": { color: "black", type: "silver" },
        "44": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "53", to: "44", promote: true });
      expect(result).toContainEqual({ type: "normal", from: "53", to: "64", promote: true });
    });
  });

  describe("金を動かす手を返す", () => {
    test("先手の場合、先手の方向に動かす手を返す", () => {
      const board = setupBoard({
        "55": { color: "black", type: "gold" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "44", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "64", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "45", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "65", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "56", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "46", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "66", promote: false });
    });

    test("後手の場合、後手の方向に動かす手を返す", () => {
      const board = setupBoard({
        "55": { color: "white", type: "gold" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "white" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "56", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "46", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "66", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "45", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "65", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "44", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "64", promote: false });
    });

    test("動かす先に自分の駒がある場合、手を返さない", () => {
      const board = setupBoard({
        "55": { color: "black", type: "gold" },
        "54": { color: "black", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
    });

    test("動かす先に相手の駒がある場合、手を返す", () => {
      const board = setupBoard({
        "55": { color: "black", type: "gold" },
        "54": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
    });

    test("金を成る手を返してはいけない", () => {
      const board = setupBoard({
        "54": { color: "black", type: "gold" },
        "53": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).not.toContainEqual({ type: "normal", from: "54", to: "53", promote: true });
    });
  });

  describe("王を動かす手を返す", () => {
    test("全方向に動かす手を返す", () => {
      const board = setupBoard({
        "55": { color: "black", type: "king" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "44", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "64", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "45", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "65", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "56", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "46", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "66", promote: false });
    });

    test("動かす先に自分の駒がある場合、手を返さない", () => {
      const board = setupBoard({
        "55": { color: "black", type: "king" },
        "54": { color: "black", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
    });

    test("動かす先に相手の駒がある場合、手を返す", () => {
      const board = setupBoard({
        "55": { color: "black", type: "king" },
        "54": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
    });

    test("王を成る手を返してはいけない", () => {
      const board = setupBoard({
        "54": { color: "black", type: "king" },
        "53": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).not.toContainEqual({ type: "normal", from: "54", to: "53", promote: true });
    });
  });

  describe("飛を動かす手を返す", () => {
    test("十字に動かす手を返す", () => {
      const board = setupBoard({
        "55": { color: "black", type: "rook" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "53", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "52", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "51", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "56", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "57", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "58", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "59", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "45", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "35", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "25", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "15", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "65", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "75", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "85", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "95", promote: false });
    });

    test("動かす先に自分の駒がある場合、その駒から先に進む手を返さない", () => {
      const board = setupBoard({
        "55": { color: "black", type: "rook" },
        "53": { color: "black", type: "pawn" },
        "58": { color: "black", type: "king" },
        "25": { color: "black", type: "knight" },
        "75": { color: "black", type: "lance" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "53", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "58", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "25", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "75", promote: false });
    });

    test("動かす先に相手の駒がある場合、その駒より先に進む手を返さない", () => {
      const board = setupBoard({
        "55": { color: "black", type: "rook" },
        "53": { color: "white", type: "pawn" },
        "58": { color: "white", type: "king" },
        "25": { color: "white", type: "knight" },
        "75": { color: "white", type: "lance" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "53", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "58", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "25", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "75", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "52", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "51", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "59", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "15", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "85", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "95", promote: false });
    });

    test("飛が3段目以降に動く場合、成る手も含める", () => {
      const board = setupBoard({
        "55": { color: "black", type: "rook" },
        "53": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "53", promote: true });
    });

    test("飛が3段目以降から動く場合、成る手を含める", () => {
      const board = setupBoard({
        "53": { color: "black", type: "rook" },
        "23": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "53", to: "23", promote: true });
    });
  });

  describe("角を動かす手を返す", () => {
    test("斜めに動かす手を返す", () => {
      const board = setupBoard({
        "55": { color: "black", type: "bishop" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "44", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "33", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "22", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "11", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "66", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "77", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "88", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "99", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "46", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "37", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "28", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "19", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "64", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "73", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "82", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "91", promote: false });
    });

    test("動かす先に自分の駒がある場合、その駒から先に進む手を返さない", () => {
      const board = setupBoard({
        "55": { color: "black", type: "bishop" },
        "33": { color: "black", type: "pawn" },
        "66": { color: "black", type: "king" },
        "37": { color: "black", type: "knight" },
        "73": { color: "black", type: "lance" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "33", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "66", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "37", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "73", promote: false });
    });

    test("動かす先に相手の駒がある場合、その駒より先に進む手を返さない", () => {
      const board = setupBoard({
        "55": { color: "black", type: "bishop" },
        "33": { color: "white", type: "pawn" },
        "66": { color: "white", type: "king" },
        "37": { color: "white", type: "knight" },
        "73": { color: "white", type: "lance" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "33", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "66", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "37", promote: false });
      expect(result).toContainEqual({ type: "normal", from: "55", to: "73", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "22", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "11", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "77", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "88", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "99", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "28", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "19", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "82", promote: false });
      expect(result).not.toContainEqual({ type: "normal", from: "55", to: "91", promote: false });
    });

    test("角が3段目以降に動く場合、成る手も含める", () => {
      const board = setupBoard({
        "55": { color: "black", type: "bishop" },
        "33": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "55", to: "33", promote: true });
    });

    test("角が3段目以降から動く場合、成る手を含める", () => {
      const board = setupBoard({
        "33": { color: "black", type: "bishop" },
        "44": { color: "white", type: "pawn" },
      });
      const hands = setupHands();
      const position = { board, hands, turn: "black" as const };
      const result = pseudoLegalMovesOf(position);

      expect(result).toContainEqual({ type: "normal", from: "33", to: "44", promote: true });
    });
  });

  describe("金と同じ動きの成駒を動かす手を返す", () => {
    const cases = [
      { type: "pawn+", name: "と" },
      { type: "lance+", name: "成香" },
      { type: "knight+", name: "成桂" },
      { type: "silver+", name: "成銀" },
    ] as const;

    for (const { type, name } of cases) {
      test(`${name}を動かす手を返す`, () => {
        const board = setupBoard({
          "55": { color: "black", type },
        });
        const hands = setupHands();
        const position = { board, hands, turn: "black" as const };
        const result = pseudoLegalMovesOf(position);

        expect(result).toContainEqual({ type: "normal", from: "55", to: "54", promote: false });
        expect(result).toContainEqual({ type: "normal", from: "55", to: "44", promote: false });
        expect(result).toContainEqual({ type: "normal", from: "55", to: "64", promote: false });
        expect(result).toContainEqual({ type: "normal", from: "55", to: "45", promote: false });
        expect(result).toContainEqual({ type: "normal", from: "55", to: "65", promote: false });
        expect(result).toContainEqual({ type: "normal", from: "55", to: "56", promote: false });
        expect(result).not.toContainEqual({ type: "normal", from: "55", to: "46", promote: false });
        expect(result).not.toContainEqual({ type: "normal", from: "55", to: "66", promote: false });
      });
    }
  });
});
