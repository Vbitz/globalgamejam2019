import * as THREE from 'three';

import {Chunk, Tile} from './Chunk';
import {TilePosition} from './common';
import {Entity} from './Entity';
import {Game} from './Game';

export class World extends Entity {
  private testChunk: Chunk;

  constructor(game: Game) {
    super(game);

    this.testChunk = new Chunk(this.game);

    this.add(this.testChunk);
  }

  getTileFromPosition(x: number, y: number): Tile|undefined {
    return this.testChunk.getTileFromPosition(x, y);
  }

  getTile(x: number, y: number): Tile|undefined {
    return this.testChunk.getTile(x, y);
  }

  getTileWorldPosition(tile: Tile): TilePosition|undefined {
    return {x: tile.x, y: tile.y};
  }

  calculateWorldPosition(x: number, y: number): THREE.Vector3 {
    return this.testChunk.calculateWorldPosition(x, y);
  }

  getTileNeighbor(tile: Tile, offset: [number, number]): Tile|undefined {
    // TODO(joshua): Check if tile exists on a chunk boundary.
    return this.testChunk.getTileNeighbor(tile, offset);
  }
}