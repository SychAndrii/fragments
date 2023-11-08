const logger = require('../../../../logger');
const { Fragment } = require('../../../../model/fragment');
const { createErrorResponse } = require('../../../../response');
var md = require('markdown-it')();

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
    const lastDotPos = id.lastIndexOf('.');

    if(lastDotPos !== -1) {
      const idWithoutExtension = id.substring(0, lastDotPos);
      const extension = id.substring(lastDotPos + 1);
      
      const fragment = await Fragment.byId(req.user, idWithoutExtension);

      const formats = fragment.formats;
      const fragmentBody = await fragment.getData();

      logger.info({
        extension
      }, 'INSIDE EXTENSION')

      if(formats.includes(extension)) {
        const mdData = md.render(fragmentBody.toString());
        res.setHeader('Content-Length', mdData.length);
    
        return res.status(200).type('text/markdown').send(mdData);
      }
    }
    else {
      console.log(id);
      const fragment = await Fragment.byId(req.user, id);
      const fragmentBody = await fragment.getData();

      res.setHeader('Content-Length', fragment.size);
  
      logger.debug(
        {
          fragment,
        },
        'Sending fragment body'
      );
  
      return res.status(200).type(fragment.type).send(fragmentBody);
    }
  } catch (error) {
    logger.error(
      {
        id,
        message: error.message,
      },
      'Unable to send fragment body!'
    );
    res.status(404).json(createErrorResponse(404, 'Unable to send fragment body!'));
  }
};
