class Nuk extends HTMLElement{
    constructor() {
        super();
        this.shadowRoot = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
        this.onMount();
    }

    onMount() {}

    template() {}

    render() {
        this.shadowRoot.innerHTML = this.template();
    }
}

module.exports = Nuk;