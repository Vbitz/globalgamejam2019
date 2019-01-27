import * as THREE from 'three';

export type Bag<T> = {
  [s: string]: T
};

export function expect(): never {
  throw new Error('Expect failed');
}

// All three of these are an attempt to get more clarity in the code that uses
// them. The names are still not universally applied and could be misleading.

/**
 * The global index of a tile in the tile grid.
 */
export interface GlobalTilePosition {
  x: number;
  y: number;

  __flag?: 'globalTile';
}

/**
 * The local index of a tile in the tile grid.
 */
export interface LocalTilePosition {
  x: number;
  y: number;

  __flag?: 'localTile';
}

/**
 * The global index of a chunk in the world grid.
 */
export interface ChunkPosition {
  x: number;
  y: number;

  __flag?: 'chunk';
}

/**
 * A OpenGL world position that comes from frontend rendering code.
 */
export interface WorldPosition {
  x: number;
  y: number;

  __flag?: 'world';
}

export function tileDistance(a: GlobalTilePosition, b: GlobalTilePosition) {
  return Math.sqrt(Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2));
}

export function worldDistance(a: WorldPosition, b: WorldPosition) {
  return Math.sqrt(Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2));
}

export function setMaterial(
    obj: THREE.Object3D, name: string, material: THREE.Material) {
  material.name = name;

  if (!(obj instanceof THREE.Mesh)) {
    throw new Error('Not Implemented');
  }

  if (!Array.isArray(obj.material)) {
    if (obj.material.name !== name) {
      return;
    } else {
      obj.material = material;
    }
  } else {
    let i = 0;
    for (const mat of obj.material) {
      if (mat.name === name) {
        obj.material[i] = material;
      }

      i++;
    }
  }
}