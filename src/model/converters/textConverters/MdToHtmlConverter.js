const Converter = require("../Converter");
const md = require('markdown-it')();

class MdToHtmlConverter extends Converter {
    constructor(fragment) {
        super(fragment);
    }

    async convert() {
        const fragmentData = await this.fragment.getData();
        const mdData = md.render(fragmentData.toString());
        
        return {
            dataType: 'text/html',
            dataLength: mdData.length,
            convertedData: mdData
        }
    }
}

module.exports = MdToHtmlConverter;