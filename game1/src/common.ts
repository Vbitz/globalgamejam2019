import * as THREE from 'three';

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