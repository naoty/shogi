import { legalPlaysOf } from "./legal-plays";
import { columnOf, rowOf, squareOf, squares } from "./square";
import type { Board, Color, Position, Square } from "./types";

/**
 * 王手を判定する
 *
 * 引数のpositionにおいて、turnの手番の場合に王手がかかっているかを返す。
 */
export function isCheck(position: Position, turn: Color = position.turn): boolean {
  const kingSquare = kingSquareOf(position, turn);

  for (const square of squares) {
    const piece = position.board[square];

    if (piece === null || piece.color === turn) continue;

    switch (piece.type) {
      case "pawn": {
        const forward = piece.color === "black" ? -1 : 1;
        const attacks = steppingAttacksOf(square, [[0, forward]]);
        if (attacks.some((attack) => attack === kingSquare)) return true;
        break;
      }
      case "lance": {
        const forward = piece.color === "black" ? -1 : 1;
        const attacks = slidingAttacksOf(position.board, square, [[0, forward]]);
        if (attacks.some((attack) => attack === kingSquare)) return true;
        break;
      }
      case "knight": {
        const forward = piece.color === "black" ? -2 : 2;
        const attacks = steppingAttacksOf(square, [
          [-1, forward],
          [1, forward],
        ]);
        if (attacks.some((attack) => attack === kingSquare)) return true;
        break;
      }
      case "silver": {
        const forward = piece.color === "black" ? -1 : 1;
        const attacks = steppingAttacksOf(square, [
          [0, forward],
          [-1, forward],
          [1, forward],
          [-1, -forward],
          [1, -forward],
        ]);
        if (attacks.some((attack) => attack === kingSquare)) return true;
        break;
      }
      case "gold":
      case "pawn+":
      case "lance+":
      case "knight+":
      case "silver+": {
        const forward = piece.color === "black" ? -1 : 1;
        const attacks = steppingAttacksOf(square, [
          [0, forward],
          [-1, forward],
          [1, forward],
          [-1, 0],
          [1, 0],
          [0, -forward],
        ]);
        if (attacks.some((attack) => attack === kingSquare)) return true;
        break;
      }
      case "bishop": {
        const attacks = slidingAttacksOf(position.board, square, [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ]);
        if (attacks.some((attack) => attack === kingSquare)) return true;
        break;
      }
      case "rook": {
        const attacks = slidingAttacksOf(position.board, square, [
          [0, 1],
          [0, -1],
          [-1, 0],
          [1, 0],
        ]);
        if (attacks.some((attack) => attack === kingSquare)) return true;
        break;
      }
      case "rook+": {
        const attacks = [
          ...slidingAttacksOf(position.board, square, [
            [0, 1],
            [0, -1],
            [-1, 0],
            [1, 0],
          ]),
          ...steppingAttacksOf(square, [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
          ]),
        ];
        if (attacks.some((attack) => attack === kingSquare)) return true;
        break;
      }
      case "bishop+": {
        const attacks = [
          ...slidingAttacksOf(position.board, square, [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
          ]),
          ...steppingAttacksOf(square, [
            [0, 1],
            [0, -1],
            [-1, 0],
            [1, 0],
          ]),
        ];
        if (attacks.some((attack) => attack === kingSquare)) return true;
        break;
      }
      // 玉による王手は自殺手であるが、合法手だけが指されることを前提としない
      case "king": {
        const attacks = steppingAttacksOf(square, [
          [0, 1],
          [0, -1],
          [-1, 0],
          [1, 0],
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ]);
        if (attacks.some((attack) => attack === kingSquare)) return true;
        break;
      }
    }
  }

  return false;
}

/**
 * 詰みを判定する
 */
export function isCheckmate(position: Position, turn: Color = position.turn): boolean {
  return isCheck(position, turn) && legalPlaysOf(position, turn).length === 0;
}

function kingSquareOf(position: Position, color: Color): Square {
  for (const square of squares) {
    const piece = position.board[square];
    if (piece !== null && piece.color === color && piece.type === "king") {
      return square;
    }
  }

  throw new Error(`invalid position: no king of color ${color}`);
}

type Direction = readonly [number, number];

function steppingAttacksOf(from: Square, directions: readonly Direction[]): Square[] {
  const fromColumn = columnOf(from);
  const fromRow = rowOf(from);

  const attacks: Square[] = [];

  for (const [columnDirection, rowDirection] of directions) {
    const toColumn = fromColumn + columnDirection;
    const toRow = fromRow + rowDirection;
    const to = squareOf(toColumn, toRow);
    if (to === null) continue;

    attacks.push(to);
  }

  return attacks;
}

function slidingAttacksOf(board: Board, from: Square, directions: readonly Direction[]): Square[] {
  const fromColumn = columnOf(from);
  const fromRow = rowOf(from);

  const attacks: Square[] = [];

  for (const [columnDirection, rowDirection] of directions) {
    for (let distance = 1; distance <= 8; distance++) {
      const toColumn = fromColumn + columnDirection * distance;
      const toRow = fromRow + rowDirection * distance;
      const to = squareOf(toColumn, toRow);
      if (to === null) break;

      attacks.push(to);

      // 駒があればそれ以上進めない
      if (board[to] !== null) break;
    }
  }

  return attacks;
}
