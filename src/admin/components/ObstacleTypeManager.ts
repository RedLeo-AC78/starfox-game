type ObstacleType = {
  id: number;
  name: string;
  shape: string;
  dimensions: string;
  createdAt: string;
};

export class ObstacleTypeManager {
  private el: HTMLElement;
  private list: ObstacleType[] = [];
  private message: string = "";
  private messageType: "success" | "error" = "success";

  constructor() {
    this.el = document.createElement("section");
    this.el.classList.add("section");
    this.el.id = "obstacletypes-section";
    this.fetchItems();
    this.render();
  }

  getElement() {
    return this.el;
  }

  async fetchItems() {
    try {
      const res = await fetch("http://localhost:8000/api/obstacle-types");
      if (!res.ok) throw new Error("Erreur lors du chargement des obstacles");
      this.list = await res.json();
    } catch (e) {
      this.message = "Erreur réseau : " + (e as Error).message;
      this.messageType = "error";
      this.list = [];
    }
    this.render();
  }

  async addItem(name: string, shape: string, dimensions: string) {
    try {
      const res = await fetch("http://localhost:8000/api/obstacle-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          shape,
          dimensions,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        this.message = "Erreur à l'ajout : " + err;
        this.messageType = "error";
      } else {
        this.message = "Obstacle ajouté avec succès !";
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
      const res = await fetch(`http://localhost:8000/api/obstacle-types${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.text();
        this.message = "Erreur à la suppression : " + err;
        this.messageType = "error";
      } else {
        this.message = "Obstacle supprimé !";
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
      <h2>Types d'obstacles</h2>
      ${this.message ? `<div class="${this.messageType}">${this.message}</div>` : ""}
      <form id="add-form">
        <input name="name" placeholder="Nom" required />
        <input name="shape" placeholder="Forme" required />
        <input name="dimensions" placeholder="Dimensions" required />
        <button type="submit">Ajouter</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Forme</th>
            <th>Dimensions</th>
            <th>Créé le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.list
            .map(
              (obs) => `
            <tr>
              <td>${obs.name}</td>
              <td>${obs.shape}</td>
              <td>${obs.dimensions}</td>
              <td>${obs.createdAt}</td>
              <td class="actions">
                <button data-id="${obs.id}" class="delete-btn">Supprimer</button>
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
      const shape = (form.elements.namedItem("shape") as HTMLInputElement).value;
      const dimensions = (form.elements.namedItem("dimensions") as HTMLInputElement).value;
      if (!name.trim() || !shape.trim() || !dimensions.trim()) {
        this.message = "Champs obligatoires manquants.";
        this.messageType = "error";
        this.render();
        return;
      }
      this.addItem(name, shape, dimensions);
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
