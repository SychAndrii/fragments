const Converter = require("../Converter");

class JsonToTxtConverter extends Converter {
    constructor(fragment) {
        super(fragment);
    }

    async convert() {
        const fragmentData = await this.fragment.getData();
        const text = JSON.stringify(JSON.parse(fragmentData.toString()), null, 2);
        
        return {
            dataType: 'text/plain',
            dataLength: text.length,
            convertedData: text
        }
    }
}

module.exports = JsonToTxtConverter;