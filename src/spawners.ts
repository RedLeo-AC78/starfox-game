// src/spawners.ts
import {
  Scene,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Mesh,
  Vector3,
  SceneLoader,
  AbstractMesh,
} from "@babylonjs/core";




// import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

import "@babylonjs/loaders"; 

// ← Tableaux PARTAGÉS pour toute la logique de jeu
export const enemies: any[] = [];
export const obstacles: Mesh[] = [];
export const items: { mesh: AbstractMesh; type: string }[] = [];


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

 let modelName: string;
  if (type === 1) {
    modelName = "wingedPrototype.glb";
  } else {
    modelName = "landMaster.glb";
  }

  // Charge le modèle 3D
  SceneLoader.ImportMeshAsync(
    "",
    "/models/",         // Attention : ce chemin est relatif à /public
    modelName,
    scene
  ).then((result) => {
    const mesh = result.meshes[0]; // Premier mesh importé
    mesh.position = new Vector3(x, y, z);

    // Applique une couleur si besoin (matériau custom)
    // const mat = new StandardMaterial("enemyMat", scene);
    // mat.diffuseColor = new Color3(1, 0, 0);
    // mesh.material = mat;

    // Ajoute à la liste des ennemis avec les propriétés existantes
    if (type === 1) {
      enemies.push({ mesh, hp: 10, type, vx, originX: x, rangeX });
    } else {
      enemies.push({ mesh, hp: 15, type, shootTimer: 0, fireInterval });
    }
  });
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
  
  // Correspondance type de bonus <-> modèle
  let modelName = "";
  switch (kind) {
    case "silver":
      modelName = "silverRing.glb";
      break;
    case "gold":
      modelName = "goldRing.glb";
      break;
    case "laserBlue":
      modelName = "blueLaser.glb";
      break;
    case "laserRed":
      modelName = "redLaser.glb";
      break;
    case "bomb":
      modelName = "smartBomb.glb"; // OU garde la sphère si pas de modèle
      break;
    default:
      console.warn("createItem: type inconnu", kind);
      return;
  }
  // Chargement du modèle 3D :
  SceneLoader.ImportMeshAsync(
    "",
    "/models/",
    modelName,
    scene
  ).then((result) => {
    const mesh = result.meshes[0];
    mesh.position = new Vector3(x, y, z);
    // Option : mesh.scaling = new Vector3(1, 1, 1);
    items.push({ mesh, type: kind });
  });
}