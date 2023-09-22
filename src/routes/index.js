const { Router } = require('express');
const { author, version } = require('../../package.json');
const { authenticate } = require('../auth');
const { createSuccessResponse } = require('../response');

const router = Router();

router.use('/v1', authenticate(), require('./api'));

// Define a simple health check route. If the server is running
// we'll respond with a 200 OK.  If not, the server isn't healthy.
router.get('/', (req, res) => {
  // Clients shouldn't cache this response (always request it fresh)
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#controlling_caching
  res.setHeader('Cache-Control', 'no-cache');

  // Send a 200 'OK' response with info about our repo

  res.status(200).json(
    createSuccessResponse({
      author,
      githubUrl: 'https://github.com/SychAndrii/fragments.git',
      version,
    })
  );
});

module.exports = router;
