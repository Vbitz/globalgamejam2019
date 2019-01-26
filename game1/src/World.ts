import * as THREE from 'three';

import {Entity} from './Entity';
import {Game} from './Game';

export class World extends Entity {
  constructor(game: Game) {
    super(game);

    this.add(new THREE.Mesh(
        new THREE.PlaneGeometry(8, 8),
        new THREE.MeshBasicMaterial({color: 'red'})));
  }
}