const ErrorBase = require('./')

class MimeTypesDoNotMatch extends ErrorBase {
    constructor(fragmentId, setMimeType, actualMimeType) {
        super(`Fragment with id (${fragmentId}) with mime-type set as (${setMimeType}) has actual mime-type as ${actualMimeType}`);
    }
}

module.exports = MimeTypesDoNotMatch;