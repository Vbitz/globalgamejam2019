import * as THREE from 'three';

import {Entity} from './Entity';
import {Game} from './Game';

export class Player extends Entity {
  readonly camera = new THREE.PerspectiveCamera();
  readonly geometry = new THREE.Mesh(
      new THREE.CubeGeometry(2, 2, 2),
      new THREE.MeshBasicMaterial({color: 'pink'}));

  private raycaster = new THREE.Raycaster();

  constructor(game: Game) {
    super(game);

    this.camera.position.add(new THREE.Vector3(0, 0, 10));

    this.camera.rotateZ(0);

    this.add(this.camera, this.geometry);
  }

  onResize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  onMouseClick(x: number, y: number) {
    const intersections = this.getIntersections(x, y);

    console.log(intersections);
  }

  private getIntersections(x: number, y: number) {
    // From: https://jsfiddle.net/Q84kS/14/
    const mouse = {x: 0, y: 0};

    mouse.x = ((x - this.game.renderer.domElement.offsetLeft) /
               this.game.renderer.domElement.width) *
            2 -
        1;
    mouse.y = -((y - this.game.renderer.domElement.offsetTop) /
                this.game.renderer.domElement.height) *
            2 +
        1;

    this.raycaster.setFromCamera(mouse, this.camera);

    const intersects =
        this.raycaster.intersectObjects(this.game.scene.children, true);

    return intersects;
  }
}