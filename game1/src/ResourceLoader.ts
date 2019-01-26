import * as THREE from 'three';
import {OBJLoader} from './third_party/OBJLoader';

export class ResourceLoader {
  private objLoader = new OBJLoader();

  loadOBJContent(content: string): THREE.Group {
    return this.objLoader.parse(content);
  }
}