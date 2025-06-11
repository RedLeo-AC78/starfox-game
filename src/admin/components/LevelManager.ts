type Level = {
  id: number;
  name: string;
  jsonData: string;
  createdAt: string;
};

export class LevelManager {
  private el: HTMLElement;
  private list: Level[] = [];
  private message: string = "";
  private messageType: "success" | "error" = "success";

  constructor() {
    this.el = document.createElement("section");
    this.el.classList.add("section");
    this.el.id = "levels-section";
    this.fetchItems();
    this.render();
  }

  getElement() {
    return this.el;
  }

  async fetchItems() {
    try {
      const res = await fetch("http://localhost:8000/api/levels");
      if (!res.ok) throw new Error("Erreur lors du chargement des niveaux");
      this.list = await res.json();
    } catch (e) {
      this.message = "Erreur réseau : " + (e as Error).message;
      this.messageType = "error";
      this.list = [];
    }
    this.render();
  }

  async addItem(name: string, jsonData: string) {
    try {
      const res = await fetch("http://localhost:8000/api/levels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          jsonData,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        this.message = "Erreur à l'ajout : " + err;
        this.messageType = "error";
      } else {
        this.message = "Niveau ajouté avec succès !";
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
      const res = await fetch(`http://localhost:8000/api/levels/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.text();
        this.message = "Erreur à la suppression : " + err;
        this.messageType = "error";
      } else {
        this.message = "Niveau supprimé !";
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
      <h2>Niveaux</h2>
      ${this.message ? `<div class="${this.messageType}">${this.message}</div>` : ""}
      <form id="add-form">
        <input name="name" placeholder="Nom" required />
        <textarea name="jsonData" placeholder="Json data" required rows="3" style="width: 240px;"></textarea>
        <button type="submit">Ajouter</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>JSON</th>
            <th>Créé le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.list
            .map(
              (level) => `
            <tr>
              <td>${level.name}</td>
              <td><pre style="max-width:260px;white-space:pre-wrap;word-break:break-all;background:#222634;color:#fbbf24;border-radius:7px;padding:6px;">${level.jsonData}</pre></td>
              <td>${level.createdAt}</td>
              <td class="actions">
                <button data-id="${level.id}" class="delete-btn">Supprimer</button>
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
      const jsonData = (form.elements.namedItem("jsonData") as HTMLInputElement).value;
      if (!name.trim() || !jsonData.trim()) {
        this.message = "Champs obligatoires manquants.";
        this.messageType = "error";
        this.render();
        return;
      }
      this.addItem(name, jsonData);
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
