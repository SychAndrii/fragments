const logger = require('../../../../logger');
const { Fragment } = require('../../../../model/fragment');
const { createErrorResponse, createSuccessResponse } = require('../../../../response');

/**
 * Get a fragment by id for current user
 */
module.exports = async (req, res) => {
  const { id } = req.params;
  logger.debug(
    {
      id,
      user: req.user,
    },
    'Received /GET/:id/info request.'
  );
  try {
    const fragment = await Fragment.byId(req.user, id);
    res.setHeader('Content-Length', fragment.size);

    logger.debug(
      {
        fragment,
      },
      'Sending fragment metadata'
    );

    return res.status(200).json(
      createSuccessResponse({
        fragment,
      })
    );
  } catch (error) {
    logger.error(
      {
        error,
      },
      'Unable to send fragment body!'
    );
    res.status(404).json(createErrorResponse(404, 'Unable to send fragment body!'));
  }
};
