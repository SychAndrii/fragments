const MimeTypesDoNotMatch = require('../../../errors/MimeTypesDoNotMatch');
const logger = require('../../../logger');
const { Fragment } = require('../../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../../response');
const FragmentNotFound = require('../../../errors/FragmentNotFound');
const contentType = require('content-type');

/**
 * Update a fragment by id for current user
 */
module.exports = async (req, res) => {
  const { id } = req.params;
  let type = req.get('Content-Type');

  logger.debug(
    {
      id,
      user: req.user
    },
    'Received /PUT/:id request.'
  );

  try {
    if (Fragment.isSupportedType(type) && Buffer.isBuffer(req.body)) {
      const f = await Fragment.byId(req.user, id);
      type = contentType.parse(type).type;

      if(f.type != type) {
        throw new MimeTypesDoNotMatch(f.id, type, f.type);
      }

      await f.setData(req.body);

      res.status(200).json(
        createSuccessResponse({
          fragment: {
            ...f,
          },
        })
      );
    } else {
      logger.warn({type}, 'Unable to update a fragment!');
      res.status(415).json(createErrorResponse(415, 'Unsupported Data Type!'));
    }
  } catch (error) {
    logger.error(
      {
        error,
        message: error.message,
      },
      'GOT ERROR WHILE /PUT/:id REQUEST'
    );
    if (error instanceof FragmentNotFound) {
      res.status(404).json(createErrorResponse(404, 'Fragment does not exist!'));
    } else if (error instanceof MimeTypesDoNotMatch) {
      res.status(400).json(createErrorResponse(400, `Content-type of this fragment is not ${type}!`));
    } else {
      res.status(500).json(createErrorResponse(500, error.message));
    }
  }
};
