import * as THREE from 'three';

import {Chunk} from './Chunk';
import {Entity} from './Entity';
import {Game} from './Game';

export class World extends Entity {
  private testChunk: Chunk;

  constructor(game: Game) {
    super(game);

    this.testChunk = new Chunk(this.game);

    this.add(this.testChunk);
  }
}