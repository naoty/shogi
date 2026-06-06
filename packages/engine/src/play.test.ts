import { describe, expect, test } from "vitest";
import { boardWith, initialBoard } from "./board";
import { applyPlay } from "./play";
import { setupHands } from "./test-data";

describe("applyPlay", () => {
  test("先手と後手を切り替える", () => {
    const hands = setupHands();
    const position1 = { board: initialBoard, hands, turn: "black" as const };
    const play1 = { type: "move" as const, from: "77" as const, to: "76" as const, promote: false };
    const position2 = applyPlay(position1, play1);
    expect(position2.turn).toBe("white");

    const play2 = { type: "move" as const, from: "33" as const, to: "34" as const, promote: false };
    const position3 = applyPlay(position2, play2);
    expect(position3.turn).toBe("black");
  });

  test("駒を指す手の場合、移動元のマスを空にし、移動先のマスに駒を置く", () => {
    const board = boardWith({
      "28": { color: "black", type: "rook" },
      "24": { color: "white", type: "pawn" },
    });
    const hands = setupHands();
    const position1 = { board, hands, turn: "black" as const };
    const play = { type: "move" as const, from: "28" as const, to: "24" as const, promote: false };
    const position2 = applyPlay(position1, play);
    expect(position2.board["28"]).toBeNull();
    expect(position2.board["24"]).toEqual({ color: "black", type: "rook" });
  });

  test("駒を指す手が成る場合、移動先のマスに成った駒を置く", () => {
    const board = boardWith({
      "88": { color: "black", type: "bishop" },
      "22": { color: "white", type: "bishop" },
    });
    const hands = setupHands();
    const position1 = { board, hands, turn: "black" as const };
    const play = { type: "move" as const, from: "88" as const, to: "22" as const, promote: true };
    const position2 = applyPlay(position1, play);
    expect(position2.board["88"]).toBeNull();
    expect(position2.board["22"]).toEqual({ color: "black", type: "bishop+" });
  });

  test("駒を指す手で、移動元のマスに駒がない場合、エラーを投げる", () => {
    const board = boardWith();
    const hands = setupHands();
    const position = { board, hands, turn: "black" as const };
    const play = { type: "move" as const, from: "88" as const, to: "22" as const, promote: false };
    expect(() => applyPlay(position, play)).toThrow("illegal play: no piece at 88");
  });
});
