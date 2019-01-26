import {Tile} from './Chunk';
import {expect, tileDistance, TilePosition} from './common';
import {Game} from './Game';

export interface PathPoint {
  tile: Tile;
  pos: TilePosition;
}

function getWithDefault<K, V>(map: Map<K, V>, key: K, defaultValue: V): V {
  const value = map.get(key);

  if (value === undefined) {
    return defaultValue;
  } else {
    return value;
  }
}

/**
 * Roll d20 to determine execution time.
 */
export class PathFinder {
  constructor(private game: Game) {}

  getPath(startTile: Tile, endTile: Tile): PathPoint[]|undefined {
    // Using A* from: https://en.wikipedia.org/wiki/A*_search_algorithm
    const closedSet = new Set<Tile>();

    const openSet = new Set<Tile>();

    openSet.add(startTile);

    const cameFrom = new Map<Tile, Tile>();

    const gScore = new Map<Tile, number>();

    gScore.set(startTile, 0);

    const fScore = new Map<Tile, number>();

    fScore.set(endTile, this.estimateDistance(startTile, endTile));

    while (openSet.size !== 0) {
      const current =
          [...openSet.entries()]
              .map(([t, _]) => [t, getWithDefault(fScore, t, Infinity)])
              .sort(([_1, a], [_2, b]) => (a as number) - (b as number)) as
          Array<[Tile, number]>;

      const [currentNode, _] = current[0];

      if (currentNode === endTile) {
        return this.reconstructPath(currentNode, cameFrom);
      }

      openSet.delete(currentNode);
      closedSet.add(currentNode);

      for (const neighbor
               of [/* Top Row */[-1, -1], [0, -1], [1, -1],
                   /* Middle Row */[-1, 0], [1, 0],
                   /* Bottom Row */[-1, 1], [0, 1], [1, 1]] as
           Array<[number, number]>) {
        const neighborNode = this.game.getTileNeighbor(currentNode, neighbor);

        if (neighborNode === undefined || neighborNode.isSolid()) {
          continue;
        }

        if (closedSet.has(neighborNode)) {
          continue;
        }

        const tentativeGScore =
            (getWithDefault(gScore, currentNode, Infinity)) +
            this.estimateDistance(currentNode, neighborNode);

        if (!openSet.has(neighborNode)) {
          openSet.add(neighborNode);
        } else if (
            tentativeGScore >=
            (getWithDefault(gScore, neighborNode, Infinity))) {
          continue;
        }

        cameFrom.set(neighborNode, currentNode);
        gScore.set(neighborNode, tentativeGScore);
        fScore.set(
            neighborNode,
            getWithDefault(gScore, neighborNode, Infinity) +
                this.estimateDistance(neighborNode, endTile));
      }
    }
    return undefined;
  }

  private reconstructPath(start: Tile, cameFrom: Map<Tile, Tile>): PathPoint[] {
    const ret: PathPoint[] = [];

    let current = start;

    ret.push({
      tile: current,
      pos: this.game.getWorldPositionFromTile(current) || expect()
    });

    while (cameFrom.has(current)) {
      current = cameFrom.get(current) || expect();
      ret.push({
        tile: current,
        pos: this.game.getWorldPositionFromTile(current) || expect()
      });
    }

    return ret;
  }

  private estimateDistance(a: Tile, b: Tile) {
    const aPos = this.game.getWorldPositionFromTile(a) || expect();
    const bPos = this.game.getWorldPositionFromTile(b) || expect();

    return tileDistance(aPos, bPos);
  }
}