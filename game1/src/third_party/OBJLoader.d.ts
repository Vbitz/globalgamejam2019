// tslint:disable

import * as THREE from 'three';

export class OBJLoader {
  constructor(manager?: THREE.LoadingManager);
  manager: THREE.LoadingManager;
  regexp: any;
  materials: THREE.Material[];
  path: string;

  load(
      url: string, onLoad: (group: THREE.Group) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void): void;
  parse(data: string): THREE.Group;
  setPath(value: string): void;
  setMaterials(materials: THREE.MaterialCreator): void;
  _createParserState(): any;
}
