class Converter {
    constructor(fragment) {
        this.fragment = fragment;
    }

    async convert() {
        throw new Error('You must use concrete type of converter!');
    }
}

module.exports = Converter;