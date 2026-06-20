import { describe, expect, test } from "vitest";
import { boardWith } from "./board";
import { isCheckmate } from "./checkmate";
import { setupHands } from "./test-data";

describe("isCheckmate", () => {
  test("詰みを判定する", () => {
    const board = boardWith({
      "59": { color: "black", type: "king" },
      "57": { color: "white", type: "gold" },
      "58": { color: "white", type: "gold" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };

    expect(isCheckmate(position)).toBe(true);
  });

  test("不詰を判定する", () => {
    const board = boardWith({
      "59": { color: "black", type: "king" },
      "57": { color: "white", type: "gold" },
      "58": { color: "white", type: "pawn" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };

    expect(isCheckmate(position)).toBe(false);
  });

  test("引数で渡した手番に詰みがかかっているか判定する", () => {
    const board = boardWith({
      "51": { color: "white", type: "king" },
      "52": { color: "black", type: "gold" },
      "53": { color: "black", type: "gold" },
      "59": { color: "black", type: "king" },
    });
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };

    expect(isCheckmate(position, "white")).toBe(true);
  });
});
