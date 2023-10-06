const { Fragment } = require('../../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  const { id } = req.params;
  try {
    const fragment = await Fragment.byId(req.user, id);
    const fragmentBody = await fragment.getData();

    res.setHeader('Content-Length', fragment.size);
    res.setHeader('Content-Type', fragment.type);

    return res.status(200).send(fragmentBody);
  } catch (error) {
    console.log(error.message);
  }
};
