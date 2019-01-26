import * as THREE from 'three';

import {Chunk, CHUNK_HEIGHT, CHUNK_WIDTH, Tile} from './Chunk';
import {ChunkPosition, TilePosition, WorldPosition} from './common';
import {Entity} from './Entity';
import {Game} from './Game';

export class World extends Entity {
  private testChunk: Chunk;

  constructor(game: Game) {
    super(game);

    this.testChunk = new Chunk(this.game);

    this.add(this.testChunk);
  }

  /**
   * Returns the tile at world position {x, y}
   * @param x
   * @param y
   */
  getTileFromWorldPosition(worldPos: WorldPosition): Tile|undefined {
    // TODO(joshua): This function should convert to tilePosition then call
    // getTileFromTilePosition.
    return this.testChunk.getTileFromWorldPosition(worldPos);
  }

  /**
   *
   * @param x
   * @param y
   */
  getTileFromTilePosition(tilePos: TilePosition): Tile|undefined {
    return this.testChunk.getTileFromTilePosition(tilePos);
  }

  /**
   *
   * @param tile
   */
  getWorldPositionFromTile(tile: Tile): WorldPosition|undefined {
    return {x: tile.pos.x, y: tile.pos.y};
  }

  /**
   *
   * @param x
   * @param y
   */
  calculateWorldPosition(x: number, y: number): THREE.Vector3 {
    return this.testChunk.calculateWorldPosition(x, y);
  }

  /**
   *
   * @param tile
   * @param offset
   */
  getTileNeighbor(tile: Tile, offset: [number, number]): Tile|undefined {
    // TODO(joshua): Check if tile exists on a chunk boundary.
    return this.testChunk.getTileNeighbor(tile, offset);
  }

  /**
   * This function is badly named. It removes the half chunk offset between
   * world and chunk positions. This does not convert from a world position to a
   * chunk index.
   */
  private worldPositionToChunkPosition(worldPos: WorldPosition): WorldPosition {
    return {
      x: worldPos.x + (CHUNK_WIDTH / 2),
      y: worldPos.y + (CHUNK_HEIGHT / 2)
    };
  }

  private lookupChunkByWorldPosition(worldPos: WorldPosition) {
    const chunkPos = this.worldPositionToChunkPosition(worldPos);

    return this.getChunk({
      x: Math.floor(chunkPos.x / CHUNK_WIDTH),
      y: Math.floor(chunkPos.y / CHUNK_HEIGHT)
    });
  }

  private getChunk(location: ChunkPosition) {
    return this.testChunk;
  }
}