import { describe, expect, test } from "vitest";
import { initialBoard } from "./board";
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
});
