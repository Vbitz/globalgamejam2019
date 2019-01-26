export type Bag<T> = {
  [s: string]: T
};

export function expect(): never {
  throw new Error('Expect failed');
}

export interface TilePosition {
  x: number;
  y: number;
}

export function tileDistance(a: TilePosition, b: TilePosition) {
  return Math.sqrt(Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2));
}