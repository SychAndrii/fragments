const ErrorBase = require('./')

class FragmentNotFound extends ErrorBase {
    constructor(fragmentId, ownerId) {
        super(`Fragment with id (${fragmentId}) does not belong to user with id (${ownerId})`);
    }
}

module.exports = FragmentNotFound;