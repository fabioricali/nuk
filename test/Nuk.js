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
                    console.log(this.shadow)
                    this.innerHTML = 'ciao'
                    console.log(this.shadow)
                }

                onMount() {
                    console.log('MOUNTED')
                }
            });

            document.body.innerHTML = '<x-component></x-component>';


            console.log(document.body.innerHTML)
        })
    });
});