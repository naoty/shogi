/**
 * 局面
 */
export type Position = {
  board: Board;
  hands: Hands;
  turn: Color;
};

/**
 * 盤
 */
export type Board = Record<Square, Piece | null>;

/**
 * 両者の持ち駒
 */
export type Hands = Record<Color, Hand>;

/**
 * 持ち駒
 */
export type Hand = Record<DroppablePieceType, number>;

/**
 * マス
 */
export type Square = `${Column}${Row}`;

/**
 * 筋
 */
export type Column = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * 段
 */
export type Row = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * 駒
 */
export type Piece = {
  color: Color;
  type: PieceType;
};

/**
 * 先後
 *
 * - black: 先手
 * - white: 後手
 */
export type Color = "black" | "white";

/**
 * 駒の種類
 */
export type PieceType = UnpromotedPieceType | PromotedPieceType;

/**
 * 通常の駒の種類
 */
export type UnpromotedPieceType =
  | "king" // 王/玉
  | "rook" // 飛
  | "bishop" // 角
  | "gold" // 金
  | "silver" // 銀
  | "knight" // 桂
  | "lance" // 香
  | "pawn"; // 歩

/**
 * 成駒の種類
 */
export type PromotedPieceType =
  | "rook+" // 龍
  | "bishop+" // 馬
  | "silver+" // 成銀
  | "knight+" // 成桂
  | "lance+" // 成香
  | "pawn+"; // と

/**
 * 持ち駒の種類
 */
export type DroppablePieceType = Exclude<UnpromotedPieceType, "king">;

/**
 * 手
 */
export type Play = Move | Drop;

/**
 * 指し手
 */
export type Move = {
  type: "move";
  from: Square;
  to: Square;
  promote: boolean;
};

/**
 * 持ち駒を打つ手
 */
export type Drop = {
  type: "drop";
  piece: DroppablePieceType;
  to: Square;
};
