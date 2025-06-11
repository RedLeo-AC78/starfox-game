# Starfox Rail Shooter - Front End

French


🎮 Présentation

Starfox Rail Shooter est un jeu de type rail shooter inspiré de la célèbre franchise Star Fox. Le joueur prend les commandes d'un Arwing et parcourt des niveaux linéaires en 3D, affronte des vagues d'ennemis, évite des obstacles, collecte des bonus et créer vos niveaux.


✨ Fonctionnalités

Système de rail : le vaisseau avance automatiquement, la caméra suit dynamiquement le joueur.

Ennemis dynamiques : IA basique, tirs, différents types d’ennemis.

Obstacles : champs d’astéroïdes, barrières à esquiver.

Collecte d’objets : anneaux (goldRing), bonus de tirs, bombes.

Bombes : touche B pour détruire tout sur votre passage.

"Do a barrel roll" : touche E pour effectuer un « barrel roll » et éviter les tirs.

Panneau d’administration : interface Web (public/admin.html) pour créer ou modifier facilement vos niveaux au format JSON.


🛠️ Technologies

Babylon.js (rendering 3D)

TypeScript & Vite (bundling & dev server)

Modèles 3D au format glTF (.glb) situés dans public/models

Node.js & NPM pour la gestion des dépendances


⚙️ Installation

Prérequis

Node.js (v16 ou supérieure)

NPM (v8 ou supérieure)

Installer le projet

# Cloner le dépôt
git clone <URL_DU_DEPOT>
cd starfox-game-main

# Installer les dépendances
npm install


🚀 Utilisation

Mode développement

npm run dev

Ouvrez ensuite dans votre navigateur : http://localhost:5173/ pour lancer le jeu.

Build & aperçu en production

npm run build
npm run preview

Par défaut, le serveur de preview s'ouvre sur le port 4173 (vérifiez la console pour l'URL exacte).

Panneau d'administration

Pour créer ou éditer des niveaux, cliquez sur le bouton Admin en haut à droite du jeu ou ouvrez :

http://localhost:5173/admin.html

Les fichiers de niveaux sont stockés dans public/levels au format JSON.


🎮 Contrôles

Action                 Touche(s)

Déplacement     /    ZQSD (AZERTY) ou flèches

Accélérer       /    Shift 

Ralentir        /    Ctrl

Tirer           /    Espace

Larguer une bombe  / B

Barrel roll        / E



# Starfox Rail Shooter - Front End

English

🎮 Overview

Starfox Rail Shooter is a rail shooter game inspired by the classic Star Fox franchise. Players pilot an Arwing through linear 3D courses, battling waves of enemies, dodging obstacles, and collecting power-ups.

✨ Features

3D On-Rails Movement: The ship advances automatically, with a dynamic camera following the player.

Enemy Variety: Basic AI enemies with different behaviors and attack patterns.

Obstacles: Navigate through asteroid fields and energy barriers.

Collectibles: Gather gold rings, weapon upgrades, and bombs.

Bomb Ability: Press B to unleash a bomb, clearing all enemies in range.

Barrel Roll: Press E to perform a barrel roll and evade incoming fire.

Web-Based Level Editor: Use the admin panel (public/admin.html) to create or modify levels stored as JSON files.

🛠️ Technologies

Babylon.js for 3D rendering

TypeScript & Vite for development and bundling

3D models in glTF (.glb) format located in public/models

Node.js & npm for dependency management

⚙️ Installation

Prerequisites

Node.js v16 or later

npm v8 or later

Setup

# Clone the repository
git clone <REPO_URL>
cd starfox-game-main

# Install dependencies
npm install

🚀 Running the Game

Development Mode

npm run dev

Then open your browser to http://localhost:5173/ to play.

Production Build & Preview

npm run build
npm run preview

By default, the preview server runs on port 4173 (check the console for the exact URL).

Admin Panel

To create or edit levels, click the Admin button at the top-right of the game or open:

http://localhost:5173/admin.html

Levels are stored in public/levels in JSON format.

🎮 Controls

Action        Key(s)

Move        /  WASD (QWERTY) or Arrow Keys

Accelerate  /  Shift

Slow Down   /  Ctrl

Fire        /  Spacebar

Drop Bomb   /  B

Barrel Roll /  E
