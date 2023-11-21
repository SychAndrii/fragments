const express = require('express');
const { Fragment } = require('../../model/fragment');

// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      return Fragment.isSupportedType(req.headers['content-type']);
    },
  });

const router = express.Router();

router.get('/fragments', require('./get'));
router.get('/fragments/:id/info', require('./get/id/info'));
router.get('/fragments/:id', require('./get/id'));
router.post('/fragments', rawBody(), require('./post'));
router.delete('/fragments/:id', require('./delete/id/'));

module.exports = router;
