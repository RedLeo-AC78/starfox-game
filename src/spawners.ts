// src/spawners.ts
import {
  Scene,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Mesh,
} from "@babylonjs/core";

// ← Tableaux PARTAGÉS pour toute la logique de jeu
export const enemies: any[] = [];
export const obstacles: Mesh[] = [];
export const items: { mesh: Mesh; type: string }[] = [];

/**
 * Crée un ennemi (drone ou tourelle) et l’ajoute à `enemies[]`
 */
export function createEnemy(
  scene: Scene,
  type: number,
  x: number,
  y: number,
  z: number,
  vx?: number,
  rangeX?: number,
  fireInterval?: number
): void {
  const mat = new StandardMaterial("enemyMat", scene);
  mat.diffuseColor = new Color3(1, 0, 0);

  let mesh;
  if (type === 1) {
    mesh = MeshBuilder.CreateSphere("drone", { diameter: 1 }, scene);
    enemies.push({ mesh, hp: 10, type, vx, originX: x, rangeX });
  } else {
    mesh = MeshBuilder.CreateBox("turret", { size: 2 }, scene);
    enemies.push({ mesh, hp: 15, type, shootTimer: 0, fireInterval });
  }

  mesh.material = mat;
  mesh.position.set(x, y, z);
}

/**
 * Crée un obstacle ("arch" ou "building") et l’ajoute à `obstacles[]`
 */
export function createObstacle(
  scene: Scene,
  kind: string,
  x: number,
  y: number,
  z: number
): void {
  const mat = new StandardMaterial("obsMat", scene);
  mat.diffuseColor = new Color3(0.5, 0.5, 0.5);

  if (kind === "arch") {
    const p1 = MeshBuilder.CreateBox(
      "pillar1",
      { width: 2, height: 10, depth: 2 },
      scene
    );
    const p2 = MeshBuilder.CreateBox(
      "pillar2",
      { width: 2, height: 10, depth: 2 },
      scene
    );
    const b = MeshBuilder.CreateBox(
      "beam",
      { width: 14, height: 2, depth: 2 },
      scene
    );
    p1.position.set(x - 6, y + 5, z);
    p2.position.set(x + 6, y + 5, z);
    b.position.set(x, y + 10, z);
    [p1, p2, b].forEach((m) => {
      m.material = mat;
      obstacles.push(m);
    });
  } else {
    const b = MeshBuilder.CreateBox(
      "building",
      { width: 8, height: 8, depth: 8 },
      scene
    );
    b.position.set(x, y + 4, z);
    b.material = mat;
    obstacles.push(b);
  }
}

/**
 * Crée un bonus (anneau, module laser, bombe) et l’ajoute à `items[]`
 */
export function createItem(
  scene: Scene,
  kind: string,
  x: number,
  y: number,
  z: number
): void {
  const mat = new StandardMaterial(kind + "Mat", scene);
  let mesh;

  switch (kind) {
    case "silver":
      mat.diffuseColor = new Color3(0.8, 0.8, 0.8);
      mesh = MeshBuilder.CreateTorus(
        "silverRing",
        { diameter: 5, thickness: 0.5 },
        scene
      );
      mesh.rotation.x = Math.PI / 2;
      break;
    case "gold":
      mat.diffuseColor = new Color3(1, 0.8, 0);
      mesh = MeshBuilder.CreateTorus(
        "goldRing",
        { diameter: 5, thickness: 0.5 },
        scene
      );
      mesh.rotation.x = Math.PI / 2;
      break;
    case "laserBlue":
      mat.diffuseColor = new Color3(0, 0, 1);
      mesh = MeshBuilder.CreateBox("laserBluePU", { size: 2 }, scene);
      break;
    case "laserRed":
      mat.diffuseColor = new Color3(1, 0, 0);
      mesh = MeshBuilder.CreateBox("laserRedPU", { size: 2 }, scene);
      break;
    case "bomb":
      mat.diffuseColor = new Color3(1, 1, 1);
      mesh = MeshBuilder.CreateSphere("bombPU", { diameter: 1.5 }, scene);
      break;
    default:
      console.warn("createItem: type inconnu", kind);
      return;
  }

  mesh.material = mat;
  mesh.position.set(x, y, z);
  items.push({ mesh, type: kind });
}
