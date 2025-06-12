type ItemDefinition = {
  id: number;
  itemKey: string;
  name: string;
  effectType: string;
  effectValue: number;
  iconPath: string;
  createdAt: string;
};

export class ItemDefinitionManager {
  private el: HTMLElement;
  private list: ItemDefinition[] = [];
  private message: string = "";
  private messageType: "success" | "error" = "success";

  constructor() {
    this.el = document.createElement("section");
    this.el.classList.add("section");
    this.el.id = "itemdefinitions-section";
    this.fetchItems();
    this.render();
  }

  getElement() {
    return this.el;
  }

  async fetchItems() {
    try {
      const res = await fetch("http://localhost:8001/api/items");
      if (!res.ok) throw new Error("Erreur lors du chargement des objets");
      this.list = await res.json();
    } catch (e) {
      this.message = "Erreur réseau : " + (e as Error).message;
      this.messageType = "error";
      this.list = [];
    }
    this.render();
  }

  async addItem(
    itemKey: string,
    name: string,
    effectType: string,
    effectValue: number,
    iconPath: string
  ) {
    try {
      const res = await fetch("http://localhost:8001/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemKey,
          name,
          effectType,
          effectValue,
          iconPath,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        this.message = "Erreur à l'ajout : " + err;
        this.messageType = "error";
      } else {
        this.message = "Objet ajouté avec succès !";
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
      const res = await fetch(`http://localhost:8001/api/items/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.text();
        this.message = "Erreur à la suppression : " + err;
        this.messageType = "error";
      } else {
        this.message = "Objet supprimé !";
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
      <h2>Objets</h2>
      ${
        this.message
          ? `<div class="${this.messageType}">${this.message}</div>`
          : ""
      }
      <form id="add-form">
        <input name="itemKey" placeholder="Clé (itemKey)" required />
        <input name="name" placeholder="Nom" required />
        <input name="effectType" placeholder="Type d'effet" required />
        <input name="effectValue" type="number" placeholder="Valeur de l'effet" required />
        <input name="iconPath" placeholder="Icone (chemin)" required />
        <button type="submit">Ajouter</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Clé</th>
            <th>Nom</th>
            <th>Type d'effet</th>
            <th>Valeur effet</th>
            <th>Icône</th>
            <th>Créé le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.list
            .map(
              (item) => `
            <tr>
              <td>${item.itemKey}</td>
              <td>${item.name}</td>
              <td>${item.effectType}</td>
              <td>${item.effectValue}</td>
              <td><span title="${item.iconPath}">${
                item.iconPath
                  ? `<img src="${item.iconPath}" alt="icone" style="height:28px;vertical-align:middle;border-radius:5px;background:#eee;" onerror="this.style.display='none'">`
                  : ""
              }</span></td>
              <td>${item.createdAt}</td>
              <td class="actions">
                <button data-id="${
                  item.id
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
      const itemKey = (form.elements.namedItem("itemKey") as HTMLInputElement)
        .value;
      const name = (form.elements.namedItem("name") as HTMLInputElement).value;
      const effectType = (
        form.elements.namedItem("effectType") as HTMLInputElement
      ).value;
      const effectValue = +(
        form.elements.namedItem("effectValue") as HTMLInputElement
      ).value;
      const iconPath = (form.elements.namedItem("iconPath") as HTMLInputElement)
        .value;
      if (
        !itemKey.trim() ||
        !name.trim() ||
        !effectType.trim() ||
        isNaN(effectValue) ||
        !iconPath.trim()
      ) {
        this.message = "Champs obligatoires manquants.";
        this.messageType = "error";
        this.render();
        return;
      }
      this.addItem(itemKey, name, effectType, effectValue, iconPath);
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
