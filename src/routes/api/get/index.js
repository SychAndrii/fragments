const { Fragment } = require('../../../model/fragment');
const { createSuccessResponse } = require('../../../response');
const logger = require('../../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  logger.debug(
    {
      user: req.user,
    },
    'Received /GET request.'
  );

  const fragments = await Fragment.byUser(req.user, req.query.expand);

  return res.status(200).json(
    createSuccessResponse({
      fragments,
    })
  );
};
