class Nuk extends HTMLElement{
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = 'hello';
    }

    onMount() {}

    connectedCallback() {
        console.log('connected');
        this.onMount()
    }
}

module.exports = Nuk;