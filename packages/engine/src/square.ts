import type { Column, Row, Square } from "./types";

// biome-ignore format: keep shogi board layout
export const squares = [
  "11", "12", "13", "14", "15", "16", "17", "18", "19",
  "21", "22", "23", "24", "25", "26", "27", "28", "29",
  "31", "32", "33", "34", "35", "36", "37", "38", "39",
  "41", "42", "43", "44", "45", "46", "47", "48", "49",
  "51", "52", "53", "54", "55", "56", "57", "58", "59",
  "61", "62", "63", "64", "65", "66", "67", "68", "69",
  "71", "72", "73", "74", "75", "76", "77", "78", "79",
  "81", "82", "83", "84", "85", "86", "87", "88", "89",
  "91", "92", "93", "94", "95", "96", "97", "98", "99",
] as const satisfies readonly Square[];

export function squareOf(column: number, row: number): Square | null {
  if (!isColumn(column) || !isRow(row)) return null;
  return `${column}${row}`;
}

export function columnOf(square: Square): Column {
  return Number(square[0]) as Column;
}

export function rowOf(square: Square): Row {
  return Number(square[1]) as Row;
}

function isColumn(value: number): value is Column {
  return 1 <= value && value <= 9;
}

function isRow(value: number): value is Row {
  return 1 <= value && value <= 9;
}
