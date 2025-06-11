export class Menu {
  private el: HTMLElement;
  private current: string | null = null;

  constructor(
    private sections: string[],
    private onSectionChange: (section: string) => void
  ) {
    this.el = document.createElement("nav");
    this.sections.forEach((section) => {
      const btn = document.createElement("button");
      btn.textContent = section.charAt(0).toUpperCase() + section.slice(1);
      btn.onclick = () => this.setActive(section);
      this.el.appendChild(btn);
    });
    if (this.sections.length > 0) this.setActive(this.sections[0]);
  }

  setActive(section: string) {
    Array.from(this.el.children).forEach((child, i) => {
      (child as HTMLElement).classList.toggle(
        "active",
        this.sections[i] === section
      );
    });
    if (this.current !== section) {
      this.current = section;
      this.onSectionChange(section);
    }
  }

  getElement() {
    return this.el;
  }
}
