import * as THREE from 'three';
import {Game} from './Game';

export class Entity extends THREE.Object3D {
  constructor(protected game: Game) {
    super();
  }
}