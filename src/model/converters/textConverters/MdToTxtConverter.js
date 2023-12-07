const Converter = require("../Converter");
const removeMd = require('remove-markdown');

class MdToTxtConverter extends Converter {
    constructor(fragment) {
        super(fragment);
    }

    async convert() {
        const fragmentData = await this.fragment.getData();
        const text = removeMd(fragmentData.toString());
        
        return {
            dataType: 'text/plain',
            dataLength: text.length,
            convertedData: text
        }
    }
}

module.exports = MdToTxtConverter;