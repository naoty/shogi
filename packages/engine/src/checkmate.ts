import { isCheck } from "./check";
import { legalPlaysOf } from "./legal-plays";
import type { Color, Position } from "./types";

/**
 * 詰みを判定する
 */
export function isCheckmate(position: Position, turn: Color = position.turn): boolean {
  return isCheck(position, turn) && legalPlaysOf(position, turn).length === 0;
}
