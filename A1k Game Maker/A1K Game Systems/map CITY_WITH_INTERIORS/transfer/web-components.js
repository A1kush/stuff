class TransferNpc extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute('id') || crypto.randomUUID();
    const x = Number(this.getAttribute('x') || 0);
    const y = Number(this.getAttribute('y') || 0);
    const sprite = this.getAttribute('sprite') || '';
    const name = this.getAttribute('name') || '';
    const dialogue = this.getAttribute('dialogue') || '';
    window.Transfer && window.Transfer.addNPC({ id, x, y, sprite, name, dialogue });
  }
}
class TransferHouse extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute('id') || crypto.randomUUID();
    const x = Number(this.getAttribute('x') || 0);
    const y = Number(this.getAttribute('y') || 0);
    const width = Number(this.getAttribute('width') || 64);
    const height = Number(this.getAttribute('height') || 64);
    const label = this.getAttribute('label') || '';
    const interiorManifest = this.getAttribute('interior-manifest') || '';
    window.Transfer && window.Transfer.addHouse({ id, x, y, width, height, label, interiorManifest });
  }
}
customElements.define('transfer-npc', TransferNpc);
customElements.define('transfer-house', TransferHouse);


