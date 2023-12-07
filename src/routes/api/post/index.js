const { createSuccessResponse, createErrorResponse } = require('../../../response');
const { Fragment } = require('../../../model/fragment');
const logger = require('../../../logger');
const MimeTypesDoNotMatch = require('../../../errors/MimeTypesDoNotMatch');

const apiURL = process.env.API_URL;

/**
 * Create a fragment for current user.
 */
module.exports = async (req, res) => {
  try {
    const type = req.get('Content-Type');

    if (Fragment.isSupportedType(type) && Buffer.isBuffer(req.body)) {
      const f = new Fragment({
        ownerId: req.user,
        type,
      });

      await f.setData(req.body);
      await f.save();

      const host = apiURL ? new URL(apiURL).host : req.get('host');
      const currentUrl = req.protocol + '://' + host + req.originalUrl;

      const location = new URL(currentUrl);
      location.pathname = `/v1/fragments/${f.id}`;

      res.setHeader('Location', location);

      res.status(201).json(
        createSuccessResponse({
          fragment: {
            ...f,
          },
        })
      );
    } else {
      logger.warn({}, 'Unable to create a fragment!');
      res.status(415).json(createErrorResponse(415, 'Unsupported Data Type!'));
    }
  } catch (error) {
    logger.warn({ error: error.message }, 'Unable to create a fragment!');
    
    if(error instanceof MimeTypesDoNotMatch) {
      res.status(400).json(createErrorResponse(400, 'Mime types do not match!'));
    }
    else {
      res.status(415).json(createErrorResponse(415, 'Unsupported Data Type!'));
    }
  }
};
