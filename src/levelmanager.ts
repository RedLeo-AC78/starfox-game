// src/levelmanager.ts
import type { Scene, Engine } from "@babylonjs/core";
import { createEnemy, createObstacle, createItem } from "./spawners";

export interface LevelEvent {
  triggerZ: number;
  type: "spawnEnemy" | "spawnObstacle" | "spawnItem" | "endLevel";
  params: any;
}

export class LevelManager {
  private events: LevelEvent[];
  private scene: Scene;
  private engine: Engine;
  private getPlayerZ: () => number;
  private onEnd: () => void;

  constructor(
    scene: Scene,
    engine: Engine,
    getPlayerZ: () => number,
    events: LevelEvent[],
    onEnd: () => void
  ) {
    this.scene = scene;
    this.engine = engine;
    this.getPlayerZ = getPlayerZ;
    this.onEnd = onEnd;
    this.events = events.sort((a, b) => a.triggerZ - b.triggerZ);
  }

  public update(): void {
    while (this.events.length && this.getPlayerZ() >= this.events[0].triggerZ) {
      const evt = this.events.shift()!;
      this.execute(evt);
    }
  }

  private execute(evt: LevelEvent): void {
    const p = evt.params;
    switch (evt.type) {
      case "spawnEnemy":
        this.spawnEnemy(p);
        break;
      case "spawnObstacle":
        this.spawnObstacle(p);
        break;
      case "spawnItem":
        this.spawnItem(p);
        break;
      case "endLevel":
        console.log("=== Fin de niveau ===");
        this.onEnd();
        break;
    }
  }

  private spawnEnemy(p: any): void {
    const z = p.offsetZ !== undefined ? this.getPlayerZ() + p.offsetZ : p.z;
    createEnemy(
      this.scene,
      p.enemyType,
      p.x,
      p.y,
      z,
      p.vx,
      p.rangeX,
      p.fireInterval
    );
  }

  private spawnObstacle(p: any): void {
    const z = p.offsetZ !== undefined ? this.getPlayerZ() + p.offsetZ : p.z;
    createObstacle(this.scene, p.obstacle, p.x, p.y, z);
  }

  private spawnItem(p: any): void {
    const z = p.offsetZ !== undefined ? this.getPlayerZ() + p.offsetZ : p.z;
    createItem(this.scene, p.itemType, p.x, p.y, z);
  }
}
