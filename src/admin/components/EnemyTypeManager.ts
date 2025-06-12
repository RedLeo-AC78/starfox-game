type EnemyType = {
  id: number;
  name: string;
  hp: number;
  speed: number;
  pattern: string;
  fireInterval: number;
  modelPath: string;
  createdAt: string;
};

export class EnemyTypeManager {
  private el: HTMLElement;
  private list: EnemyType[] = [];
  private message: string = "";
  private messageType: "success" | "error" = "success";

  constructor() {
    this.el = document.createElement("section");
    this.el.classList.add("section");
    this.el.id = "enemytypes-section";
    this.fetchItems();
    this.render();
  }

  getElement() {
    return this.el;
  }

  async fetchItems() {
    try {
      const res = await fetch("http://localhost:8001/api/enemy-types");
      if (!res.ok)
        throw new Error("Erreur lors du chargement des types d'ennemis");
      this.list = await res.json();
    } catch (e) {
      this.message = "Erreur réseau : " + (e as Error).message;
      this.messageType = "error";
      this.list = [];
    }
    this.render();
  }

  async addItem(
    name: string,
    hp: number,
    speed: number,
    pattern: string,
    fireInterval: number,
    modelPath: string
  ) {
    try {
      const res = await fetch("http://localhost:8001/api/enemy-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          hp,
          speed,
          pattern,
          fireInterval,
          modelPath,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        this.message = "Erreur à l'ajout : " + err;
        this.messageType = "error";
      } else {
        this.message = "Type d'ennemi ajouté avec succès !";
        this.messageType = "success";
      }
    } catch (e) {
      this.message = "Erreur réseau : " + (e as Error).message;
      this.messageType = "error";
    }
    this.fetchItems();
  }

  async deleteItem(id: number) {
    try {
      const res = await fetch(`http://localhost:8001/api/enemy-types${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.text();
        this.message = "Erreur à la suppression : " + err;
        this.messageType = "error";
      } else {
        this.message = "Type d'ennemi supprimé !";
        this.messageType = "success";
      }
    } catch (e) {
      this.message = "Erreur réseau : " + (e as Error).message;
      this.messageType = "error";
    }
    this.fetchItems();
  }

  render() {
    this.el.innerHTML = `
      <h2>Types d'ennemis</h2>
      ${
        this.message
          ? `<div class="${this.messageType}">${this.message}</div>`
          : ""
      }
      <form id="add-form">
        <input name="name" placeholder="Nom" required />
        <input name="hp" type="number" placeholder="HP" required />
        <input name="speed" type="number" placeholder="Vitesse" required step="0.01" />
        <input name="pattern" placeholder="Pattern" required />
        <input name="fireInterval" type="number" placeholder="Intervalle tir" required step="0.01" />
        <input name="modelPath" placeholder="Chemin modèle" required />
        <button type="submit">Ajouter</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>HP</th>
            <th>Vitesse</th>
            <th>Pattern</th>
            <th>Intervalle tir</th>
            <th>Modèle</th>
            <th>Créé le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.list
            .map(
              (enemy) => `
            <tr>
              <td>${enemy.name}</td>
              <td>${enemy.hp}</td>
              <td>${enemy.speed}</td>
              <td>${enemy.pattern}</td>
              <td>${enemy.fireInterval}</td>
              <td><span title="${enemy.modelPath}">${
                enemy.modelPath
                  ? `<img src="${enemy.modelPath}" alt="model" style="height:28px;vertical-align:middle;border-radius:5px;background:#eee;" onerror="this.style.display='none'">`
                  : ""
              }</span></td>
              <td>${enemy.createdAt}</td>
              <td class="actions">
                <button data-id="${
                  enemy.id
                }" class="delete-btn">Supprimer</button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    // Gestion du formulaire d'ajout
    this.el.querySelector("#add-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const name = (form.elements.namedItem("name") as HTMLInputElement).value;
      const hp = +(form.elements.namedItem("hp") as HTMLInputElement).value;
      const speed = +(form.elements.namedItem("speed") as HTMLInputElement)
        .value;
      const pattern = (form.elements.namedItem("pattern") as HTMLInputElement)
        .value;
      const fireInterval = +(
        form.elements.namedItem("fireInterval") as HTMLInputElement
      ).value;
      const modelPath = (
        form.elements.namedItem("modelPath") as HTMLInputElement
      ).value;
      if (
        !name.trim() ||
        isNaN(hp) ||
        isNaN(speed) ||
        !pattern.trim() ||
        isNaN(fireInterval) ||
        !modelPath.trim()
      ) {
        this.message = "Champs obligatoires manquants.";
        this.messageType = "error";
        this.render();
        return;
      }
      this.addItem(name, hp, speed, pattern, fireInterval, modelPath);
      form.reset();
    });

    // Suppression
    this.el.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = +(btn as HTMLButtonElement).dataset.id!;
        this.deleteItem(id);
      });
    });

    // Nettoyage message
    if (this.message) {
      setTimeout(() => {
        this.message = "";
        this.render();
      }, 3000);
    }
  }
}
