import * as THREE from 'three';

import {Tile, TileInteraction} from './Chunk';
import {expect, GlobalTilePosition, setMaterial} from './common';
import {Entity} from './Entity';
import {Game} from './Game';
import {BLENDER_MONKEY, OBJ_MEMES, PLACEHOLDER_PLAYER} from './Model';
import {PathFinder, PathPoint} from './PathFinder';

export class Player extends Entity {
  readonly camera = new THREE.PerspectiveCamera();
  readonly geometry: THREE.Group;

  private pathFinder: PathFinder;

  private raycaster = new THREE.Raycaster();

  private currentPath: PathPoint[] = [];

  constructor(game: Game) {
    super(game);

    this.geometry = this.game.resourceLoader.loadOBJContent(PLACEHOLDER_PLAYER);

    setMaterial(
        this.geometry.children[0], 'Player',
        new THREE.MeshBasicMaterial({color: 0x13f1a2}));

    console.log(this.geometry);

    this.pathFinder = new PathFinder(game);

    this.camera.position.add(new THREE.Vector3(0, 0, 10));

    this.camera.rotateZ(0);

    this.add(this.camera, this.geometry);

    setInterval(() => {
      const nextPoint = this.currentPath.pop();

      if (nextPoint === undefined) {
        return;
      }

      this.moveToTile(nextPoint.pos);
    }, 1000 / 10);
  }

  onResize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  onMouseClick(x: number, y: number) {
    const intersections = this.getIntersections(x, y);

    const interactionObject =
        this.game.getInteractionObject(this, intersections);

    if (interactionObject instanceof TileInteraction) {
      const worldPosition = this.getWorldPosition(new THREE.Vector3());

      const tile = this.game.getTileFromWorldPosition(
          {x: worldPosition.x, y: worldPosition.y});

      const path = this.pathFinder.getPath(
          tile || expect(), interactionObject.getTile() || expect());

      if (path !== undefined) {
        this.currentPath = path;
      }
    }
  }

  private moveToTile(pos: GlobalTilePosition) {
    const tileWorldPosition = this.game.getWorldPositionFromTilePosition(pos);

    this.position.set(
        tileWorldPosition.x, tileWorldPosition.y, tileWorldPosition.z);
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