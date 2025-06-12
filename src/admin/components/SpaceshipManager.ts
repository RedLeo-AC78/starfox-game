type Spaceship = {
  id: number;
  name: string;
  health: number;
  speed: number;
  maxBombs: number;
  createdAt: string;
  updatedAt: string;
};

export class SpaceshipManager {
  private el: HTMLElement;
  private list: Spaceship[] = [];
  private message: string = "";
  private messageType: "success" | "error" = "success";

  constructor() {
    this.el = document.createElement("section");
    this.el.classList.add("section");
    this.el.id = "spaceships-section";
    this.fetchItems();
    this.render();
  }

  getElement() {
    return this.el;
  }

  async fetchItems() {
    try {
      const res = await fetch("http://localhost:8001/api/spaceships");
      if (!res.ok) throw new Error("Erreur lors du chargement des vaisseaux");
      this.list = await res.json();
    } catch (e) {
      this.message = "Erreur réseau : " + (e as Error).message;
      this.messageType = "error";
      this.list = [];
    }
    this.render();
  }

  async addItem(name: string, health: number, speed: number, maxBombs: number) {
    try {
      const res = await fetch("http://localhost:8001/api/spaceships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          health,
          speed,
          maxBombs,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        this.message = "Erreur à l'ajout : " + err;
        this.messageType = "error";
      } else {
        this.message = "Vaisseau ajouté avec succès !";
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
      const res = await fetch(`http://localhost:8001/api/spaceships/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.text();
        this.message = "Erreur à la suppression : " + err;
        this.messageType = "error";
      } else {
        this.message = "Vaisseau supprimé !";
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
      <h2>Vaisseaux</h2>
      ${
        this.message
          ? `<div class="${this.messageType}">${this.message}</div>`
          : ""
      }
      <form id="add-form">
        <input name="name" placeholder="Nom" required />
        <input name="baseHp" type="number" placeholder="Vie de base" required />
        <input name="baseSpeed" type="number" placeholder="Vitesse de base" required step="0.01"/>
        <input name="maxBombs" type="number" placeholder="Bombes max" required />
        <button type="submit">Ajouter</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Vie de base</th>
            <th>Vitesse de base</th>
            <th>Bombes max</th>
            <th>Créé le</th>
            <th>Mis à jour le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.list
            .map(
              (ship) => `
            <tr>
              <td>${ship.name}</td>
              <td>${ship.health}</td>
              <td>${ship.speed}</td>
              <td>${ship.maxBombs}</td>
              <td>${ship.createdAt}</td>
              <td>${ship.updatedAt}</td>
              <td class="actions">
                <button data-id="${ship.id}" class="delete-btn">Supprimer</button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    // Formulaire d'ajout
    this.el.querySelector("#add-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const name = (form.elements.namedItem("name") as HTMLInputElement).value;
      const baseHp = +(form.elements.namedItem("health") as HTMLInputElement)
        .value;
      const baseSpeed = +(form.elements.namedItem("speed") as HTMLInputElement)
        .value;
      const maxBombs = +(
        form.elements.namedItem("maxBombs") as HTMLInputElement
      ).value;
      if (
        !name.trim() ||
        isNaN(baseHp) ||
        isNaN(baseSpeed) ||
        isNaN(maxBombs)
      ) {
        this.message = "Champs obligatoires manquants.";
        this.messageType = "error";
        this.render();
        return;
      }
      this.addItem(name, baseHp, baseSpeed, maxBombs);
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
