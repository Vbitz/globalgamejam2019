import * as THREE from 'three';

import {Chunk, CHUNK_HEIGHT, CHUNK_WIDTH, Tile} from './Chunk';
import {ChunkPosition, GlobalTilePosition, LocalTilePosition, WorldPosition} from './common';
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
    const tilePosition = this.getTilePositionFromWorldPosition(worldPos);
    return this.getTileFromTilePosition(tilePosition);
  }

  /**
   *
   * @param x
   * @param y
   */
  getTileFromTilePosition(tilePos: GlobalTilePosition): Tile|undefined {
    const chunk = this.getChunkFromTilePosition(tilePos);
    const localPos =
        this.getLocalTilePositionFromGlobalTilePosition(chunk, tilePos);
    return chunk.getTileFromTilePosition(localPos);
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
  getWorldPositionFromTilePosition(tilePos: GlobalTilePosition): THREE.Vector3 {
    const chunk = this.getChunkFromTilePosition(tilePos);
    const localPos =
        this.getLocalTilePositionFromGlobalTilePosition(chunk, tilePos);
    return this.testChunk.getWorldPositionFromTilePosition(localPos);
  }

  getTilePositionFromTile(tile: Tile): GlobalTilePosition {
    const localPos = tile.pos;

    const globalPosition =
        this.getGlobalTilePositionFromLocalTilePosition(tile.owner, localPos);

    return globalPosition;
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

  private getLocalTilePositionFromGlobalTilePosition(
      chunk: Chunk, globalTilePos: GlobalTilePosition): LocalTilePosition {
    // TODO(joshua): Fix this.
    return {x: globalTilePos.x, y: globalTilePos.y};
  }

  private getGlobalTilePositionFromLocalTilePosition(
      chunk: Chunk, localTilePos: LocalTilePosition): GlobalTilePosition {
    // TODO(joshua): Fix this.
    return {x: localTilePos.x, y: localTilePos.y};
  }

  /**
   * This function is badly named. It removes the half chunk offset between
   * world and chunk positions. This does not convert from a world position
   * to a chunk index.
   */
  private getTilePositionFromWorldPosition(worldPos: WorldPosition):
      GlobalTilePosition {
    return {
      x: Math.floor(worldPos.x + (CHUNK_WIDTH / 2)),
      y: Math.floor(worldPos.y + (CHUNK_HEIGHT / 2))
    };
  }

  private getChunkFromTilePosition(tilePos: GlobalTilePosition) {
    return this.getChunk({
      x: Math.floor(tilePos.x / CHUNK_WIDTH),
      y: Math.floor(tilePos.y / CHUNK_HEIGHT)
    });
  }

  private getChunk(location: ChunkPosition) {
    return this.testChunk;
  }
}