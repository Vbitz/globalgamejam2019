import * as THREE from 'three';

import {setMaterial} from './common';
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
      readonly owner: Chunk, readonly x: number, readonly y: number,
      public type: TileType) {}

  isSolid() {
    return this.type === TileType.Solid;
  }
}

const CHUNK_WIDTH = 16;
const CHUNK_HEIGHT = 16;

export class TileInteraction extends InteractionObject {
  constructor(
      readonly chunk: Chunk, private tileX: number, private tileY: number) {
    super();
  }

  getTile() {
    return this.chunk.getTile(this.tileX, this.tileY);
  }

  getWorldPosition(): THREE.Vector3 {
    return this.chunk.calculateWorldPosition(this.tileX, this.tileY);
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
        new THREE.MeshBasicMaterial({color: 0x2C5D27}));

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
    const tile = this.getTile(x, y);
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

    return new TileInteraction(this, Math.floor(tileX), Math.floor(tileY));
  }

  getTile(x: number, y: number): Tile|undefined {
    if (x < 0 || x > CHUNK_WIDTH - 1 || x < 0 || x > CHUNK_WIDTH - 1) {
      return undefined;
    }
    return this.tiles[x][y];
  }

  getTileFromPosition(x: number, y: number): Tile|undefined {
    return this.getTile(
        Math.floor(x + (CHUNK_WIDTH / 2)), Math.floor(y + (CHUNK_WIDTH / 2)));
  }

  calculateWorldPosition(x: number, y: number): THREE.Vector3 {
    return this.getWorldPosition(new THREE.Vector3())
        .add(this.getTileOffset(x, y));
  }

  getTileNeighbor(tile: Tile, [xOff, yOff]: [number, number]): Tile|undefined {
    return this.getTile(tile.x + xOff, tile.y + yOff);
  }

  private getTileOffset(x: number, y: number) {
    return new THREE.Vector3(
        (x - (CHUNK_WIDTH / 2)) + 0.5, (y - (CHUNK_HEIGHT / 2)) + 0.5, 0);
  }

  private init() {
    for (let x = 0; x < CHUNK_WIDTH; x++) {
      const col: Tile[] = [];
      for (let y = 0; y < CHUNK_HEIGHT; y++) {
        col.push(new Tile(this, x, y, TileType.NonSolid));
      }
      this.tiles.push(col);
    }
  }
}