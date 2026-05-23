/**
 * 局面
 */
type Position = {
  board: Board;
  hands: Hands;
  turn: Color;
}

/**
 * 盤
 */
type Board = Record<SquareKey, Piece | null>;

/**
 * 両者の持ち駒
 */
type Hands = Record<Color, Hand>;

/**
 * 持ち駒
 */
type Hand = Record<UnpromotedPieceType, number>;

/**
 * マス
 */
type Square = {
  column: Column;
  row: Row;
}

/**
 * マスのキー
 */
type SquareKey = `${Column}${Row}`;

/**
 * 筋
 */
type Column = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * 段
 */
type Row = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * 駒
 */
type Piece = {
  color: Color;
  type: PieceType;
}

/**
 * 先後
 * 
 * - black: 先手
 * - white: 後手
 */
type Color = "black" | "white";

/**
 * 駒の種類
 */
type PieceType = UnpromotedPieceType | PromotedPieceType;

/**
 * 通常の駒の種類
 */
type UnpromotedPieceType =
  | "king"    // 王/玉
  | "rook"    // 飛
  | "bishop"  // 角
  | "gold"    // 金
  | "silver"  // 銀
  | "knight"  // 桂
  | "lance"   // 香
  | "pawn";   // 歩

/**
 * 成駒の種類
 */
type PromotedPieceType =
  | "rook+"   // 龍
  | "bishop+" // 馬
  | "silver+" // 成銀
  | "knight+" // 成桂
  | "lance+"  // 成香
  | "pawn+";  // と

/**
 * 手
 */
type Move = NormalMove | DropMove;

/**
 * 指し手
 */
type NormalMove = {
  type: "normal";
  from: Square;
  to: Square;
  promote: boolean;
}

/**
 * 持ち駒を打つ手
 */
type DropMove = {
  type: "drop";
  piece: UnpromotedPieceType;
  to: Square;
}
