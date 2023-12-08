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
    'Received /DELETE/:id request.'
  );
  try {
    await Fragment.delete(req.user, id);
    return res.json(createSuccessResponse());
  } catch (error) {
      res.status(404).json(createErrorResponse(404, 'Unable to find fragment!'));
  }
};
