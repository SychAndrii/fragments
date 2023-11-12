const ConversionNotAllowed = require('../../../../errors/ConversionNotAllowed');
const FragmentNotFound = require('../../../../errors/FragmentNotFound');
const logger = require('../../../../logger');
const { Fragment } = require('../../../../model/fragment');
const { createErrorResponse } = require('../../../../response');

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
    if (lastDotPos !== -1) {
      const idWithoutExtension = id.substring(0, lastDotPos);
      const extension = id.substring(lastDotPos + 1);
      const fragment = await Fragment.byId(req.user, idWithoutExtension);

      const { convertedData, dataType } = await Fragment.getConvertedData(
        fragment,
        extension
      );

      return res.status(200).type(dataType).send(convertedData);
    } else {
      const fragment = await Fragment.byId(req.user, id);
      const fragmentBody = await fragment.getData();

      logger.debug(
        {
          fragment,
        },
        'Sending fragment body'
      );
      res.header('Content-Length', fragment.size);

      return res.status(200).type(fragment.type).send(fragmentBody);
    }
  } catch (error) {
    if (error instanceof FragmentNotFound) {
      res.status(404).json(createErrorResponse(404, 'Unable to send fragment body!'));
    }
    else if (error instanceof ConversionNotAllowed) {
      res.status(415).json(createErrorResponse(415, 'Conversion not allowed!'));
    } else {
      console.log(error.message);
      res.status(500).json(createErrorResponse(500, error.message));
    }
  }
};
