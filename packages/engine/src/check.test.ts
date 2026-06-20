import { describe, expect, test } from "vitest";
import { boardWith, initialBoard } from "./board";
import { isCheck } from "./check";
import { setupHands } from "./test-data";

describe("isCheck", () => {
  test("歩による王手を判定する", () => {
    const board = boardWith({
      "55": { color: "black", type: "king" },
      "54": { color: "white", type: "pawn" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };

    expect(isCheck(position)).toBe(true);
  });

  test("香による王手を判定する", () => {
    const board = boardWith({
      "55": { color: "black", type: "king" },
      "51": { color: "white", type: "lance" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };
    expect(isCheck(position)).toBe(true);
  });

  test("香と玉の間に駒があれば王手として判定しない", () => {
    const board = boardWith({
      "55": { color: "black", type: "king" },
      "53": { color: "black", type: "pawn" },
      "51": { color: "white", type: "lance" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };
    expect(isCheck(position)).toBe(false);
  });

  test("桂による王手を判定する", () => {
    const board = boardWith({
      "55": { color: "black", type: "king" },
      "43": { color: "white", type: "knight" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };
    expect(isCheck(position)).toBe(true);
  });

  test("銀による王手を判定する", () => {
    const board = boardWith({
      "55": { color: "black", type: "king" },
      "44": { color: "white", type: "silver" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };
    expect(isCheck(position)).toBe(true);
  });

  test("金による王手を判定する", () => {
    const board = boardWith({
      "55": { color: "black", type: "king" },
      "44": { color: "white", type: "gold" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };
    expect(isCheck(position)).toBe(true);
  });

  test("飛による王手を判定する", () => {
    const board = boardWith({
      "55": { color: "black", type: "king" },
      "15": { color: "white", type: "rook" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };
    expect(isCheck(position)).toBe(true);
  });

  test("飛と玉の間に駒があれば王手として判定しない", () => {
    const board = boardWith({
      "55": { color: "black", type: "king" },
      "45": { color: "black", type: "pawn" },
      "15": { color: "white", type: "rook" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };
    expect(isCheck(position)).toBe(false);
  });

  test("角による王手を判定する", () => {
    const board = boardWith({
      "55": { color: "black", type: "king" },
      "11": { color: "white", type: "bishop" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };
    expect(isCheck(position)).toBe(true);
  });

  test("角と玉の間に駒があれば王手として判定しない", () => {
    const board = boardWith({
      "55": { color: "black", type: "king" },
      "44": { color: "black", type: "pawn" },
      "11": { color: "white", type: "bishop" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };
    expect(isCheck(position)).toBe(false);
  });

  test("玉による王手を判定する", () => {
    const board = boardWith({
      "55": { color: "black", type: "king" },
      "44": { color: "white", type: "king" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };
    expect(isCheck(position)).toBe(true);
  });

  test("龍による王手を判定する", () => {
    const board = boardWith({
      "55": { color: "black", type: "king" },
      "15": { color: "white", type: "rook+" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };
    expect(isCheck(position)).toBe(true);
  });

  test("龍と玉の間に駒があれば王手として判定しない", () => {
    const board = boardWith({
      "55": { color: "black", type: "king" },
      "45": { color: "black", type: "pawn" },
      "15": { color: "white", type: "rook+" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };
    expect(isCheck(position)).toBe(false);
  });

  test("馬による王手を判定する", () => {
    const board = boardWith({
      "55": { color: "black", type: "king" },
      "11": { color: "white", type: "bishop+" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };
    expect(isCheck(position)).toBe(true);
  });

  test("馬と玉の間に駒があれば王手として判定しない", () => {
    const board = boardWith({
      "55": { color: "black", type: "king" },
      "44": { color: "black", type: "pawn" },
      "11": { color: "white", type: "bishop+" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };
    expect(isCheck(position)).toBe(false);
  });

  test("龍と馬以外の成駒による王手を判定する", () => {
    const board = boardWith({
      "55": { color: "black", type: "king" },
      "44": { color: "white", type: "pawn+" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };
    expect(isCheck(position)).toBe(true);
  });

  test("どの駒の指し手にも王手がないことを判定する", () => {
    const hands = setupHands();
    const position = { board: initialBoard, hands, turn: "black" as const };
    expect(isCheck(position)).toBe(false);
  });

  test("引数で渡した手番に王手がかかっているか判定する", () => {
    const board = boardWith({
      "55": { color: "white", type: "king" },
      "56": { color: "black", type: "pawn" },
      "59": { color: "black", type: "king" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };
    expect(isCheck(position, "white")).toBe(true);
  });
});
