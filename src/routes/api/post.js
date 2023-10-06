const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

const apiURL = process.env.API_URL;

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
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
    location.pathname = `/${f.id}`;

    res.setHeader('Location', location);

    res.status(201).json(
      createSuccessResponse({
        fragment: {
          ...f,
        },
      })
    );
  } else {
    res.status(415).json(
      createErrorResponse({
        fragments: 'Unsupported Data Type!',
      })
    );
  }
};
