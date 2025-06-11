import { Menu } from "./components/menu";
import { WeaponManager } from "./components/WeaponManager";
import { SpaceshipManager } from "./components/SpaceshipManager";
import { LevelManager } from "./components/LevelManager";
import { EnemyTypeManager } from "./components/EnemyTypeManager";
import { ObstacleTypeManager } from "./components/ObstacleTypeManager";
import { ItemDefinitionManager } from "./components/ItemDefinitionManager";


const sections = {
  weapons: new WeaponManager(),
  spaceships: new SpaceshipManager(),
  levels: new LevelManager(),
  enemytypes: new EnemyTypeManager(),
  obstacletypes: new ObstacleTypeManager(),
  itemdefinitions: new ItemDefinitionManager(),
};

function renderSection(section: string) {
  if (section in sections) {
    Object.keys(sections).forEach((key) => {
      const el = sections[key as keyof typeof sections].getElement();
      if (el) el.classList.remove("active");
    });
    const active = sections[section as keyof typeof sections].getElement();
    if (active) active.classList.add("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("admin-root")!;
  const menu = new Menu([
    "weapons",
    "spaceships",
    "levels",
    "enemytypes",
    "obstacletypes",
    "itemdefinitions",
  ], renderSection);
  root.appendChild(menu.getElement());
  Object.values(sections).forEach((manager) => {
    root.appendChild(manager.getElement());
  });
  renderSection("weapons");
});
