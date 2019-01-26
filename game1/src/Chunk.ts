import * as THREE from 'three';

import {setMaterial, TilePosition, WorldPosition} from './common';
import {Entity, IntractableEntity} from './Entity';
import {Game} from './Game';
import {InteractionObject} from './InteractionObject';
import {PLACEHOLDER_CHUNK} from './Model';

const enum TileType {
  Solid,
  NonSolid
}

export class Tile {
  constructor(
      readonly owner: Chunk, readonly pos: TilePosition,
      public type: TileType) {}

  isSolid() {
    return this.type === TileType.Solid;
  }
}

export const CHUNK_WIDTH = 16;
export const CHUNK_HEIGHT = 16;

export class TileInteraction extends InteractionObject {
  constructor(readonly chunk: Chunk, private tilePos: TilePosition) {
    super();
  }

  getTile() {
    return this.chunk.getTileFromTilePosition(this.tilePos);
  }

  getWorldPosition(): THREE.Vector3 {
    return this.chunk.calculateWorldPosition(this.tilePos.x, this.tilePos.y);
  }
}

export class Chunk extends IntractableEntity {
  tiles: Tile[][] = [];
  geometry: THREE.Group;

  constructor(game: Game) {
    super(game);

    this.geometry = game.resourceLoader.loadOBJContent(PLACEHOLDER_CHUNK);

    setMaterial(
        this.geometry.children[0], 'Floor',
        new THREE.MeshBasicMaterial({color: 0x101010}));

    setMaterial(
        this.geometry.children[0], 'Grass',
        new THREE.MeshBasicMaterial({color: 0x2C5D27c}));

    setMaterial(
        this.geometry.children[0], 'InnerWall',
        new THREE.MeshBasicMaterial({color: 0x4DE7E4}));

    setMaterial(
        this.geometry.children[0], 'TopRoof',
        new THREE.MeshBasicMaterial({color: 0x0065E7}));

    setMaterial(
        this.geometry.children[0], 'OuterWall',
        new THREE.MeshBasicMaterial({color: 0xE7E7E7}));

    this.add(this.geometry);

    this.init();
  }

  isSolid(x: number, y: number): boolean|undefined {
    const tile = this.getTileFromTilePosition({x, y});
    if (tile !== undefined) {
      return tile.isSolid();
    } else {
      return undefined;
    }
  }

  onInteract(source: Entity, intersect: THREE.Intersection): InteractionObject
      |null {
    const localPoint = this.worldToLocal(intersect.point);

    const tileX = localPoint.x + (CHUNK_WIDTH / 2);
    const tileY = localPoint.y + (CHUNK_HEIGHT / 2);

    return new TileInteraction(
        this, {x: Math.floor(tileX), y: Math.floor(tileY)});
  }

  getTileFromTilePosition(tilePos: TilePosition): Tile|undefined {
    if (tilePos.x < 0 || tilePos.x > CHUNK_WIDTH - 1 || tilePos.y < 0 ||
        tilePos.y > CHUNK_HEIGHT - 1) {
      return undefined;
    }
    return this.tiles[tilePos.x][tilePos.y];
  }

  getTileFromWorldPosition(worldPos: WorldPosition): Tile|undefined {
    return this.getTileFromTilePosition(
        this.getTilePositionFromWorldPosition(worldPos));
  }

  calculateWorldPosition(x: number, y: number): THREE.Vector3 {
    return this.getWorldPosition(new THREE.Vector3())
        .add(this.getTileOffset(x, y));
  }

  getTileNeighbor(tile: Tile, [xOff, yOff]: [number, number]): Tile|undefined {
    return this.getTileFromTilePosition(
        {x: tile.pos.x + xOff, y: tile.pos.y + yOff});
  }

  private getTilePositionFromWorldPosition(worldPos: WorldPosition):
      TilePosition {
    return {
      x: Math.floor(worldPos.x + (CHUNK_WIDTH / 2)),
      y: Math.floor(worldPos.y + (CHUNK_HEIGHT / 2))
    };
  }

  private getTileOffset(x: number, y: number) {
    return new THREE.Vector3(
        (x - (CHUNK_WIDTH / 2)) + 0.5, (y - (CHUNK_HEIGHT / 2)) + 0.5, 0);
  }

  private init() {
    for (let x = 0; x < CHUNK_WIDTH; x++) {
      const col: Tile[] = [];
      for (let y = 0; y < CHUNK_HEIGHT; y++) {
        col.push(new Tile(this, {x, y}, TileType.NonSolid));
      }
      this.tiles.push(col);
    }
  }
}