# starfox-fangame

Starfox Editor


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
