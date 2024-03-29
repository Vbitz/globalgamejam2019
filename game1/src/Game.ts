import * as THREE from 'three';

import {Tile} from './Chunk';
import {GlobalTilePosition, WorldPosition} from './common';
import {Entity, IntractableEntity} from './Entity';
import {InteractionObject} from './InteractionObject';
import {Player} from './Player';
import {ResourceLoader} from './ResourceLoader';
import {World} from './World';

export class Game {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  player: Player;
  world: World;
  ambientLight = new THREE.AmbientLight(new THREE.Color('white'), 1);
  resourceLoader = new ResourceLoader();

  constructor(private document: Document) {
    this.renderer = new THREE.WebGLRenderer({antialias: true});

    this.world = new World(this);
    this.player = new Player(this);
  }

  run() {
    this.document.body.appendChild(this.renderer.domElement);

    this.renderer.domElement.addEventListener(
        'click', this.onMouseClick.bind(this));

    this.renderer.domElement.id = 'main';

    window.addEventListener('resize', this.onResize.bind(this));

    this.scene.add(this.player, this.world, this.ambientLight);

    this.renderer.setClearColor(new THREE.Color('blue'));

    this.onResize();

    this.onUpdate();
  }

  getInteractionObject(source: Entity, intersections: THREE.Intersection[]):
      InteractionObject|null {
    intersections.sort((a, b) => a.distance - b.distance);

    for (const intersection of intersections) {
      const intractableEntity = this.getIntractableEntity(intersection);

      if (intractableEntity === null) {
        continue;
      }

      const interactionObject =
          intractableEntity.onInteract(source, intersection);

      if (interactionObject !== null) {
        return interactionObject;
      }
    }

    return null;
  }

  getTileFromTilePosition(tilePos: GlobalTilePosition): Tile|undefined {
    return this.world.getTileFromTilePosition(tilePos);
  }

  getTileFromWorldPosition(worldPos: WorldPosition): Tile|undefined {
    return this.world.getTileFromWorldPosition(worldPos);
  }

  getWorldPositionFromTile(tile: Tile): WorldPosition|undefined {
    return this.world.getWorldPositionFromTile(tile);
  }

  getWorldPositionFromTilePosition(tilePos: GlobalTilePosition): THREE.Vector3 {
    return this.world.getWorldPositionFromTilePosition(tilePos);
  }

  getTilePositionFromTile(tile: Tile): GlobalTilePosition {
    return this.world.getTilePositionFromTile(tile);
  }

  getTileNeighbor(tile: Tile, offset: [number, number]): Tile|undefined {
    return this.world.getTileNeighbor(tile, offset);
  }

  private getIntractableEntity(intersection: THREE.Intersection) {
    let currentObject: THREE.Object3D|null = intersection.object;

    while (currentObject !== null) {
      if (currentObject instanceof IntractableEntity) {
        return currentObject;
      }
      currentObject = currentObject.parent;
    }

    return null;
  }

  private onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.player.onResize(window.innerWidth, window.innerHeight);
  }

  private onUpdate() {
    this.renderer.render(this.scene, this.player.camera);

    window.requestAnimationFrame(this.onUpdate.bind(this));
  }

  private onMouseClick(ev: MouseEvent) {
    this.player.onMouseClick(ev.clientX, ev.clientY);
  }
}