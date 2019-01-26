import * as THREE from 'three';
import {Game} from './Game';
import {InteractionObject} from './InteractionObject';

export class Entity extends THREE.Object3D {
  constructor(protected game: Game) {
    super();
  }
}

export abstract class IntractableEntity extends Entity {
  abstract onInteract(source: Entity, intersect: THREE.Intersection):
      InteractionObject|null;
}