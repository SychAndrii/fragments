const logger = require('../../../logger');
const { Fragment } = require('../../../model/fragment');
const { createErrorResponse } = require('../../../response');

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
    'Received /GET/:id request.'
  );
  try {
    const fragment = await Fragment.byId(req.user, id);
    const fragmentBody = await fragment.getData();

    res.setHeader('Content-Length', fragment.size);
    res.setHeader('Content-Type', fragment.type);

    logger.debug(
      {
        fragment,
      },
      'Sending fragment body'
    );

    return res.status(200).send(fragmentBody);
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
