import * as THREE from 'three';

import {Player} from './Player';
import {World} from './World';

export class Game {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  player = new Player(this);
  world = new World(this);

  constructor(private document: Document) {
    this.renderer = new THREE.WebGLRenderer({antialias: true});
  }

  run() {
    this.document.body.appendChild(this.renderer.domElement);

    this.renderer.domElement.addEventListener(
        'click', this.onMouseClick.bind(this));

    this.renderer.domElement.id = 'main';

    window.addEventListener('resize', this.onResize.bind(this));

    this.scene.add(this.player, this.world);

    this.renderer.setClearColor(new THREE.Color('blue'));

    this.onResize();

    this.onUpdate();
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