// src/main.ts
import {
  Engine,
  Scene,
  FollowCamera,
  HemisphericLight,
  Vector3,
  Color3,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  Animation,
  Scalar,
} from "@babylonjs/core";

// --- Initialisation de l’engine et de la scène ---
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true);
const scene = new Scene(engine);

// --- Caméra de suivi ---
const camera = new FollowCamera("FollowCam", new Vector3(0, 0, 0), scene);
// note : attachControl ne prend plus que 0 ou 1 argument
camera.attachControl(false);

// --- Lumière ---
const light = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), scene);
light.intensity = 0.8;

// --- Vaisseau joueur ---
const playerShip = MeshBuilder.CreateBox(
  "playerShip",
  {
    width: 2,
    height: 0.5,
    depth: 4,
  },
  scene
);
playerShip.position.set(0, 5, 0);
// on désactive la rotation quaternion pour n’utiliser que rotation.x/y/z
playerShip.rotationQuaternion = null;
const shipMat = new StandardMaterial("shipMat", scene);
shipMat.diffuseColor = new Color3(0.2, 0.5, 0.8);
playerShip.material = shipMat;

// configuration de la caméra pour suivre le vaisseau
camera.lockedTarget = playerShip;
camera.rotationOffset = 180;
camera.heightOffset = 5;
camera.radius = 20;
camera.cameraAcceleration = 0.5;
camera.maxCameraSpeed = 50;

// --- Sol ---
const ground = MeshBuilder.CreateGround(
  "ground",
  {
    width: 500,
    height: 500,
  },
  scene
);
const groundMat = new StandardMaterial("groundMat", scene);
groundMat.diffuseColor = new Color3(0.1, 0.7, 0.1);
ground.material = groundMat;
ground.position.y = 0;

// --- Variables de jeu ---
let playerHP = 100;
const forwardSpeed = 20;
const strafeSpeed = 15;
const verticalSpeed = 15;
const boostMult = 2;
const brakeMult = 0.5;

let laserLevel = 0;
let bombCount = 3;

// pools de projectiles
const lasers: Mesh[] = [];
const bombs: Mesh[] = [];

// définition d’un type pour les ennemis
type Enemy = {
  mesh: Mesh;
  hp: number;
  type: number;
  vx?: number;
  originX?: number;
  rangeX?: number;
  shootTimer?: number;
  fireInterval?: number;
};
const enemies: Enemy[] = [];
const enemyBullets: Mesh[] = [];

// obstacles et bonus
const obstacles: Mesh[] = [];
const items: { mesh: Mesh; type: string }[] = [];

// --- Matériaux ---
const laserMatNormal = new StandardMaterial("laserNorm", scene);
laserMatNormal.emissiveColor = new Color3(0, 1, 0);
const laserMatDouble = new StandardMaterial("laserDub", scene);
laserMatDouble.emissiveColor = new Color3(0, 0.5, 1);
const laserMatHyper = new StandardMaterial("laserHyp", scene);
laserMatHyper.emissiveColor = new Color3(1, 0.5, 0);

const bombMat = new StandardMaterial("bombMat", scene);
bombMat.emissiveColor = new Color3(1, 0, 0);

const enemyMat = new StandardMaterial("enemyMat", scene);
enemyMat.diffuseColor = new Color3(1, 0, 0);

const enemyBullMat = new StandardMaterial("eBullMat", scene);
enemyBullMat.emissiveColor = new Color3(1, 1, 0);

const obsMat = new StandardMaterial("obsMat", scene);
obsMat.diffuseColor = new Color3(0.5, 0.5, 0.5);

const silverMat = new StandardMaterial("silver", scene);
silverMat.diffuseColor = new Color3(0.8, 0.8, 0.8);

const goldMat = new StandardMaterial("gold", scene);
goldMat.diffuseColor = new Color3(1, 0.8, 0);

const bluePUmat = new StandardMaterial("bluePU", scene);
bluePUmat.diffuseColor = new Color3(0, 0, 1);

const redPUmat = new StandardMaterial("redPU", scene);
redPUmat.diffuseColor = new Color3(1, 0, 0);

const whiteMat = new StandardMaterial("whitePU", scene);
whiteMat.diffuseColor = new Color3(1, 1, 1);

// --- Timing & collision recoil ---
let elapsedTime = 0;
let lastShootTime = 0;
const shootCooldown = 0.2;
const laserSpeed = 100;
const bombSpeed = 50;
const enemyBullSpeed = 30;

// nouvel : cooldown de collision
let collisionCooldown = 0; // secondes
const collisionRecoil = 10; // unités de recul

// --- Création d’ennemis de test ---
const e1 = MeshBuilder.CreateSphere("e1", { diameter: 1 }, scene);
e1.material = enemyMat;
e1.position.set(0, 10, 100);
enemies.push({ mesh: e1, hp: 10, type: 1, vx: 10, originX: 0, rangeX: 20 });

const e2 = MeshBuilder.CreateBox("e2", { size: 2 }, scene);
e2.material = enemyMat;
e2.position.set(10, 1, 80);
enemies.push({ mesh: e2, hp: 15, type: 2, shootTimer: 0, fireInterval: 2 });

// --- Obstacles de test ---
const p1 = MeshBuilder.CreateBox(
  "p1",
  { width: 2, height: 10, depth: 2 },
  scene
);
p1.position.set(-6, 5, 120);
const p2 = MeshBuilder.CreateBox(
  "p2",
  { width: 2, height: 10, depth: 2 },
  scene
);
p2.position.set(6, 5, 120);
const b1 = MeshBuilder.CreateBox(
  "b1",
  { width: 14, height: 2, depth: 2 },
  scene
);
b1.position.set(0, 10, 120);
const b2 = MeshBuilder.CreateBox(
  "b2",
  { width: 8, height: 8, depth: 8 },
  scene
);
b2.position.set(20, 4, 60);
const hill = MeshBuilder.CreateSphere("hill", { diameter: 20 }, scene);
hill.scaling.y = 0.5;
hill.position.set(-20, 5, 150);
obstacles.push(p1, p2, b1, b2, hill);
obstacles.forEach((o) => (o.material = obsMat));

// --- Bonus de test ---
for (let i = 0; i < 3; i++) {
  const ring = MeshBuilder.CreateTorus(
    "ringSilver" + i,
    { diameter: 5, thickness: 0.5 },
    scene
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, 10, 50 + i * 5);
  ring.material = silverMat;
  items.push({ mesh: ring, type: "silver" });
}
const ringGold = MeshBuilder.CreateTorus(
  "ringGold",
  { diameter: 5, thickness: 0.5 },
  scene
);
ringGold.rotation.x = Math.PI / 2;
ringGold.position.set(0, 10, 100);
ringGold.material = goldMat;
items.push({ mesh: ringGold, type: "gold" });

const upBlue = MeshBuilder.CreateBox("upBlue", { size: 2 }, scene);
upBlue.position.set(-10, 8, 80);
upBlue.material = bluePUmat;
items.push({ mesh: upBlue, type: "laserBlue" });

const upRed = MeshBuilder.CreateBox("upRed", { size: 2 }, scene);
upRed.position.set(10, 8, 90);
upRed.material = redPUmat;
items.push({ mesh: upRed, type: "laserRed" });

const bp = MeshBuilder.CreateSphere("bp", { diameter: 1.5 }, scene);
bp.position.set(0, 5, 70);
bp.material = whiteMat;
items.push({ mesh: bp, type: "bomb" });

// --- Gestion du clavier ---
const inputMap: { [key: string]: boolean } = {};
window.addEventListener(
  "keydown",
  (e) => (inputMap[e.key.toLowerCase()] = true)
);
window.addEventListener(
  "keyup",
  (e) => (inputMap[e.key.toLowerCase()] = false)
);

// --- Boucle de jeu ---
scene.onBeforeRenderObservable.add(() => {
  const dt = engine.getDeltaTime() / 1000;
  elapsedTime += dt;

  // mise à jour cooldown collision
  if (collisionCooldown > 0) {
    collisionCooldown -= dt;
  }

  // calcul de la vitesse d’avance, bloquée si cooldown
  let speedZ = 0;
  if (collisionCooldown <= 0) {
    speedZ = forwardSpeed;
    if (inputMap["shift"]) speedZ = forwardSpeed * boostMult;
    if (inputMap["control"]) speedZ = forwardSpeed * brakeMult;
  }

  // mouvements lat/vert
  let speedX = 0,
    speedY = 0;
  if (inputMap["arrowleft"] || inputMap["q"] || inputMap["a"])
    speedX = -strafeSpeed;
  if (inputMap["arrowright"] || inputMap["d"]) speedX = strafeSpeed;
  if (inputMap["arrowup"] || inputMap["z"] || inputMap["w"])
    speedY = verticalSpeed;
  if (inputMap["arrowdown"] || inputMap["s"]) speedY = -verticalSpeed;

  // appliquer déplacement vaisseau
  playerShip.position.x += speedX * dt;
  playerShip.position.y += speedY * dt;
  playerShip.position.z += speedZ * dt;

  // limiter zone de vol
  playerShip.position.x = Scalar.Clamp(playerShip.position.x, -25, 25);
  playerShip.position.y = Scalar.Clamp(playerShip.position.y, 1, 30);

  // inclinaison visuelle (roll/pitch)
  if (
    (inputMap["arrowleft"] || inputMap["q"] || inputMap["a"]) &&
    !(inputMap["arrowright"] || inputMap["d"])
  ) {
    playerShip.rotation.z = Scalar.Lerp(playerShip.rotation.z, 0.3, 0.2);
  } else if (
    (inputMap["arrowright"] || inputMap["d"]) &&
    !(inputMap["arrowleft"] || inputMap["q"] || inputMap["a"])
  ) {
    playerShip.rotation.z = Scalar.Lerp(playerShip.rotation.z, -0.3, 0.2);
  } else {
    playerShip.rotation.z = Scalar.Lerp(playerShip.rotation.z, 0, 0.1);
  }
  if (
    (inputMap["arrowup"] || inputMap["z"] || inputMap["w"]) &&
    !(inputMap["arrowdown"] || inputMap["s"])
  ) {
    playerShip.rotation.x = Scalar.Lerp(playerShip.rotation.x, -0.2, 0.1);
  } else if (
    (inputMap["arrowdown"] || inputMap["s"]) &&
    !(inputMap["arrowup"] || inputMap["z"] || inputMap["w"])
  ) {
    playerShip.rotation.x = Scalar.Lerp(playerShip.rotation.x, 0.2, 0.1);
  } else {
    playerShip.rotation.x = Scalar.Lerp(playerShip.rotation.x, 0, 0.1);
  }

  // barrel roll
  if (inputMap["e"]) {
    inputMap["e"] = false;
    Animation.CreateAndStartAnimation(
      "barrelR",
      playerShip,
      "rotation.z",
      60,
      20,
      playerShip.rotation.z,
      playerShip.rotation.z + 2 * Math.PI,
      0,
      undefined,
      () => {
        playerShip.rotation.z %= 2 * Math.PI;
      }
    );
  }
  if (inputMap["q"] && !inputMap["arrowleft"]) {
    inputMap["q"] = false;
    Animation.CreateAndStartAnimation(
      "barrelL",
      playerShip,
      "rotation.z",
      60,
      20,
      playerShip.rotation.z,
      playerShip.rotation.z - 2 * Math.PI,
      0,
      undefined,
      () => {
        playerShip.rotation.z %= 2 * Math.PI;
      }
    );
  }

  // tir laser
  if (inputMap[" "] && elapsedTime - lastShootTime > shootCooldown) {
    const mat =
      laserLevel === 2
        ? laserMatHyper
        : laserLevel === 1
        ? laserMatDouble
        : laserMatNormal;
    const laser = MeshBuilder.CreateSphere("laser", { diameter: 0.2 }, scene);
    laser.material = mat;
    laser.position.copyFrom(playerShip.position);
    laser.position.z += 2;
    lasers.push(laser);
    if (laserLevel >= 1) {
      const laser2 = MeshBuilder.CreateSphere(
        "laser2",
        { diameter: 0.2 },
        scene
      );
      laser2.material = mat;
      laser2.position.copyFrom(playerShip.position);
      laser.position.x -= 0.5;
      laser2.position.x += 0.5;
      laser2.position.z += 2;
      lasers.push(laser2);
    }
    lastShootTime = elapsedTime;
  }

  // lancer bombe
  if (inputMap["b"] && bombCount > 0) {
    inputMap["b"] = false;
    const bomb = MeshBuilder.CreateSphere("bomb", { diameter: 0.5 }, scene);
    bomb.material = bombMat;
    bomb.position.copyFrom(playerShip.position);
    bomb.position.z += 2;
    bombs.push(bomb);
    bombCount--;
  }

  // mise à jour lasers
  for (let i = lasers.length - 1; i >= 0; i--) {
    lasers[i].position.z += laserSpeed * dt;
    if (lasers[i].position.z > playerShip.position.z + 500) {
      lasers[i].dispose();
      lasers.splice(i, 1);
    }
  }

  // mise à jour bombes
  for (let i = bombs.length - 1; i >= 0; i--) {
    bombs[i].position.z += bombSpeed * dt;
    if (bombs[i].position.z > playerShip.position.z + 500) {
      bombs[i].dispose();
      bombs.splice(i, 1);
    }
  }

  // mise à jour ennemis (mouvement & tir)
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    if (enemy.type === 1 && enemy.vx) {
      enemy.mesh.position.x += enemy.vx * dt;
      if (enemy.originX !== undefined && enemy.rangeX !== undefined) {
        if (
          enemy.mesh.position.x > enemy.originX + enemy.rangeX ||
          enemy.mesh.position.x < enemy.originX - enemy.rangeX
        ) {
          enemy.vx = -enemy.vx;
        }
      }
    }
    if (enemy.type === 2) {
      enemy.shootTimer = (enemy.shootTimer || 0) + dt;
      if (enemy.shootTimer > (enemy.fireInterval || 2)) {
        const bullet = MeshBuilder.CreateSphere(
          "eBull",
          { diameter: 0.3 },
          scene
        );
        bullet.material = enemyBullMat;
        bullet.position.copyFrom(enemy.mesh.position);
        const dir = playerShip.position
          .subtract(enemy.mesh.position)
          .normalize();
        bullet.metadata = { vx: dir.x, vy: dir.y, vz: dir.z };
        enemyBullets.push(bullet);
        enemy.shootTimer = 0;
      }
    }
  }

  // mise à jour balles ennemies
  for (let b = enemyBullets.length - 1; b >= 0; b--) {
    const bullet = enemyBullets[b];
    if (bullet.metadata) {
      bullet.position.x += bullet.metadata.vx * enemyBullSpeed * dt;
      bullet.position.y += bullet.metadata.vy * enemyBullSpeed * dt;
      bullet.position.z += bullet.metadata.vz * enemyBullSpeed * dt;
    } else {
      bullet.position.z -= enemyBullSpeed * dt;
    }
    if (
      bullet.position.z < playerShip.position.z - 20 ||
      bullet.position.y < 0 ||
      bullet.position.z > playerShip.position.z + 500
    ) {
      bullet.dispose();
      enemyBullets.splice(b, 1);
    }
  }

  // collisions lasers -> ennemis
  for (let i = lasers.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (lasers[i].intersectsMesh(enemies[j].mesh, false)) {
        const dmg = lasers[i].material === laserMatHyper ? 5 : 2;
        enemies[j].hp -= dmg;
        lasers[i].dispose();
        lasers.splice(i, 1);
        if (enemies[j].hp <= 0) {
          enemies[j].mesh.dispose();
          enemies.splice(j, 1);
        }
        break;
      }
    }
  }

  // collisions bombes -> ennemis
  for (let i = bombs.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (bombs[i].intersectsMesh(enemies[j].mesh, false)) {
        enemies[j].hp -= 10;
        bombs[i].dispose();
        bombs.splice(i, 1);
        if (enemies[j].hp <= 0) {
          enemies[j].mesh.dispose();
          enemies.splice(j, 1);
        }
        break;
      }
    }
  }

  // collisions balles ennemies -> joueur
  for (let b = enemyBullets.length - 1; b >= 0; b--) {
    if (enemyBullets[b].intersectsMesh(playerShip, false)) {
      playerHP -= 10;
      console.log("Touché ! HP =", playerHP);
      enemyBullets[b].dispose();
      enemyBullets.splice(b, 1);
      if (playerHP <= 0) console.log("GAME OVER");
    }
  }

  // collision joueur -> ennemis
  for (let j = enemies.length - 1; j >= 0; j--) {
    if (enemies[j].mesh.intersectsMesh(playerShip, false)) {
      playerHP -= 20;
      console.log("Collision ennemi ! HP =", playerHP);
      enemies[j].mesh.dispose();
      enemies.splice(j, 1);
      if (playerHP <= 0) console.log("GAME OVER");
    }
  }

  // *** CORRECTION COLLISION OBSTACLE ***
  for (let o of obstacles) {
    if (o.intersectsMesh(playerShip, false)) {
      playerHP -= 10;
      console.log("Impact obstacle ! HP =", playerHP);
      // recul renforcé
      playerShip.position.z -= collisionRecoil;
      // blocage avance 0.5s
      collisionCooldown = 0.5;
      if (playerHP <= 0) console.log("GAME OVER");
    }
  }

  // collisions tirs -> obstacles
  for (let i = lasers.length - 1; i >= 0; i--) {
    for (let o of obstacles) {
      if (lasers[i].intersectsMesh(o, false)) {
        lasers[i].dispose();
        lasers.splice(i, 1);
        break;
      }
    }
  }
  for (let i = bombs.length - 1; i >= 0; i--) {
    for (let o of obstacles) {
      if (bombs[i].intersectsMesh(o, false)) {
        bombs[i].dispose();
        bombs.splice(i, 1);
        break;
      }
    }
  }

  // collisions joueur -> bonus
  for (let m = items.length - 1; m >= 0; m--) {
    if (items[m].mesh.intersectsMesh(playerShip, false)) {
      const type = items[m].type;
      if (type === "silver") {
        playerHP = Math.min(playerHP + 10, 100);
        console.log("Anneau argent ! HP =", playerHP);
      } else if (type === "gold") {
        playerHP = Math.min(playerHP + 25, 100);
        console.log("Anneau or ! HP =", playerHP);
      } else if (type === "laserBlue") {
        if (laserLevel < 2) {
          laserLevel++;
          console.log(laserLevel === 1 ? "Double lasers !" : "Hyper lasers !");
        }
      } else if (type === "laserRed") {
        if (laserLevel < 2) {
          laserLevel = 2;
          console.log("Hyper lasers (max) !");
        }
      } else if (type === "bomb") {
        if (bombCount < 3) {
          bombCount++;
          console.log("Bombe +1 ! Bombes =", bombCount);
        }
      }
      items[m].mesh.dispose();
      items.splice(m, 1);
    }
  }
});

// démarrage de la boucle de rendu
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
