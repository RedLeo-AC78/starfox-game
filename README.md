# 🚀 Starfox Game - Frontend (Babylon.js)

Jeu 3D inspiré de Star Fox, développé en JavaScript/TypeScript avec le moteur Babylon.js.  
Le projet propose une expérience de shoot spatial dans un univers moderne et modulaire, prêt à être enrichi !

---

## 📦 Structure du projet

```
starfox-game/
├── public/             # Fichiers statiques (modèles 3D, images, sons)
├── src/
│   ├── entities/       # Entités du jeu (joueur, ennemis, obstacles...)
│   ├── scenes/         # Logique de scènes Babylon.js
│   ├── controls/       # Gestion des entrées et contrôles
│   ├── utils/          # Fonctions utilitaires
│   └── main.ts         # Point d'entrée de l'app
├── package.json        # Dépendances et scripts NPM
└── README.md
```

---

## 🕹️ Fonctionnalités principales

- **Rendu 3D** avec Babylon.js (scène, caméra, lumières, modèles .glb)
- **Déplacement du vaisseau** (clavier ou manette)
- **Gestion des ennemis, obstacles et tirs**
- **Détection de collisions et gestion du score**
- **Chargement dynamique des assets**
- **Interface utilisateur minimaliste (HUD, menus, score)**
- **Modularité** pour ajouter facilement de nouveaux niveaux, ennemis, items, etc.

---

## 🚀 Lancer le projet en local

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/RedLeo-AC78/starfox-game.git
   cd starfox-game
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Démarrer le serveur de dev**

   ```bash
   npm run dev
   ```

4. **Accéder au jeu**
   - Ouvrez votre navigateur sur [http://localhost:5173](http://localhost:5173) (ou le port affiché dans le terminal)

---

## 🛠️ Technologies utilisées

- **[Babylon.js](https://www.babylonjs.com/)** - Moteur de rendu 3D moderne
- **JavaScript / TypeScript** - Logique du jeu
- **NPM** - Gestion des dépendances
- **GLTF/GLB** - Format des modèles 3D
- (Optionnel) **Vite** - Serveur de développement rapide

---

## 🔗 Fonctionnement général

- Le fichier `src/main.ts` initialise Babylon.js et la scène principale.
- Les entités (vaisseau, ennemis, projectiles) sont chargées comme des classes dans `src/entities/`.
- Les assets 3D sont placés dans le dossier `public/models/` et chargés via `SceneLoader`.
- La boucle de jeu gère le rendu, les mouvements, les collisions et le score.
- L’UI/HUD est soit réalisée avec Babylon.js GUI, soit en HTML/CSS overlay.

---

## ✨ Exemple de code d’initialisation Babylon.js

```typescript
const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// Caméra, lumières, chargement du vaisseau...
// Boucle de rendu
engine.runRenderLoop(() => {
  scene.render();
});
```

---

## 📁 Organisation des fichiers

- `entities/` : toutes les entités manipulables ou affichées (Player, Enemy, Projectile...)
- `controls/` : gestion des inputs (clavier, souris, manette)
- `scenes/` : création et gestion des différentes scènes Babylon.js
- `utils/` : helpers et fonctions utilitaires
- `public/models/` : modèles 3D au format GLB/GLTF
- `public/assets/` : textures, sons...

---

## 🤝 Contribuer

Les contributions sont les bienvenues !  
Proposez des issues ou des PR pour :
- Ajouter des modèles, ennemis, niveaux
- Améliorer le gameplay ou la performance
- Corriger des bugs

---

## 📚 Documentation utile

- [Babylon.js Documentation](https://doc.babylonjs.com/)
- [GLTF 3D Asset Format](https://www.khronos.org/gltf/)
- [MDN JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript)

---

## 👨‍💻 Équipe

Projet open-source à visée éducative, réalisé par des étudiants passionnés d’informatique, de jeux vidéo et de 3D !

---

## ⚠️ À savoir

- Le projet évolue régulièrement.
- Certains assets sont temporaires ou sujets à modification.
- Pensez à mettre à jour vos dépendances !

---

Bon jeu 🚀
