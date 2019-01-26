import * as THREE from 'three';

import {Entity} from './Entity';
import {Game} from './Game';

const enum TileType {
  Solid,
  NonSolid
}

class Tile {
  constructor(public type: TileType) {}

  isSolid() {
    return this.type === TileType.Solid;
  }
}

const CHUNK_WIDTH = 16;
const CHUNK_HEIGHT = 16;

export class Chunk extends Entity {
  tiles: Tile[][] = [];

  constructor(game: Game) {
    super(game);

    this.init();
  }

  isSolid(x: number, y: number): boolean|undefined {
    if (x < 0 || x > CHUNK_WIDTH - 1 || x < 0 || x > CHUNK_WIDTH - 1) {
      return undefined;
    }
    return this.tiles[x][y].isSolid();
  }

  private init() {
    for (let x = 0; x < CHUNK_WIDTH; x++) {
      const col: Tile[] = [];
      for (let y = 0; y < CHUNK_HEIGHT; y++) {
        col.push(new Tile(TileType.NonSolid));
      }
      this.tiles.push(col);
    }
  }
}