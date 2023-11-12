const logger = require("../logger");

class ErrorBase extends Error {
    constructor(message) {
        super(message);
        logger.debug({
            message
        }, 'An error occured!');
    }
}

module.exports = ErrorBase;