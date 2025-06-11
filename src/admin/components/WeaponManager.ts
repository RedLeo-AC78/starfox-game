type Weapon = {
  id: number;
  name: string;
  damage: number;
  cooldown: number;
  type: string;
  levelRequired: number;
};

export class WeaponManager {
  private el: HTMLElement;
  private list: Weapon[] = [];
  private message: string = "";
  private messageType: "success" | "error" = "success";

  constructor() {
    this.el = document.createElement("section");
    this.el.classList.add("section");
    this.el.id = "weapons-section";
    this.fetchItems();
    this.render();
  }

  getElement() {
    return this.el;
  }

  async fetchItems() {
    try {
      const res = await fetch("http://localhost:8000/api/weapons");
      if (!res.ok) throw new Error("Erreur lors du chargement des armes");
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
    damage: number,
    cooldown: number,
    type: string,
    levelRequired: number
  ) {
    try {
      const res = await fetch("http://localhost:8000/api/weapons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          damage,
          cooldown,
          type,
          levelRequired,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        this.message = "Erreur à l'ajout : " + err;
        this.messageType = "error";
      } else {
        this.message = "Arme ajoutée avec succès !";
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
      const res = await fetch(`http://localhost:8000/api/weapons/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.text();
        this.message = "Erreur à la suppression : " + err;
        this.messageType = "error";
      } else {
        this.message = "Arme supprimée !";
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
      <h2>Armes</h2>
      ${this.message ? `<div class="${this.messageType}">${this.message}</div>` : ""}
      <form id="add-form">
        <input name="name" placeholder="Nom" required />
        <input name="damage" type="number" placeholder="Dégâts" required />
        <input name="cooldown" type="number" placeholder="Cooldown" required step="0.01"/>
        <input name="type" placeholder="Type" required />
        <input name="levelRequired" type="number" placeholder="Niveau requis" required />
        <button type="submit">Ajouter</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Dégâts</th>
            <th>Cooldown</th>
            <th>Type</th>
            <th>Niveau requis</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.list
            .map(
              (w) => `
            <tr>
              <td>${w.name}</td>
              <td>${w.damage}</td>
              <td>${w.cooldown}</td>
              <td>${w.type}</td>
              <td>${w.levelRequired}</td>
              <td class="actions">
                <button data-id="${w.id}" class="delete-btn">Supprimer</button>
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
      const damage = +(form.elements.namedItem("damage") as HTMLInputElement).value;
      const cooldown = +(form.elements.namedItem("cooldown") as HTMLInputElement).value;
      const type = (form.elements.namedItem("type") as HTMLInputElement).value;
      const levelRequired = +(form.elements.namedItem("levelRequired") as HTMLInputElement).value;
      if (!name.trim() || isNaN(damage) || isNaN(cooldown) || !type.trim() || isNaN(levelRequired)) {
        this.message = "Champs obligatoires manquants.";
        this.messageType = "error";
        this.render();
        return;
      }
      this.addItem(name, damage, cooldown, type, levelRequired);
      form.reset();
    });

    // Gestion de la suppression
    this.el.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = +(btn as HTMLButtonElement).dataset.id!;
        this.deleteItem(id);
      });
    });

    // Nettoie le message après 3 secondes
    if (this.message) {
      setTimeout(() => {
        this.message = "";
        this.render();
      }, 3000);
    }
  }
}
