const Nuk = require('../');

describe('Nuk', function () {
    beforeEach(function () {
        document.body.innerHTML = '';
    });

    describe('create basic Nuk App', function () {
        it('should be ok', function () {
            window.customElements.define('x-component', class extends Nuk {
                constructor() {
                    super();
                }

                template() {
                    return `
                        <div> 
                            hello Nuk
                        </div>
                    `;
                }

                onMount() {
                    console.log(this.shadowRoot);
                }
            });

            document.body.innerHTML = '<x-component/>';


            console.log(document.body.innerHTML)
        })
    });
});