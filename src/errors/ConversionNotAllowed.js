const ErrorBase = require('./')

class ConversionNotAllowed extends ErrorBase {
    constructor(fragmentType, extension) {
        super(`Fragment of type (${fragmentType}) cannot be converted to data type with (${extension}) extension`);
    }
}

module.exports = ConversionNotAllowed;