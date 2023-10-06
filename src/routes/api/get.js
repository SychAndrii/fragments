const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const fragments = await Fragment.byUser(req.user, req.query.expand);

  return res.status(200).json(
    createSuccessResponse({
      fragments,
    })
  );
};
