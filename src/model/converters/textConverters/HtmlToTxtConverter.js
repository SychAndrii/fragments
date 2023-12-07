const Converter = require("../Converter");
const { convert } = require('html-to-text');

class HtmlToTxtConverter extends Converter {
    constructor(fragment) {
        super(fragment);
    }

    async convert() {
        const fragmentData = await this.fragment.getData();
        const txt = convert(fragmentData.toString());
        
        return {
            dataType: 'text/plain',
            dataLength: txt.length,
            convertedData: txt
        }
    }
}

module.exports = HtmlToTxtConverter;