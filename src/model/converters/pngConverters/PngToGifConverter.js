const Converter = require('../Converter');
const sharp = require('sharp');

class PngToGifConverter extends Converter {
  constructor(fragment) {
    super(fragment);
  }

  async convert() {
    const fragmentData = await this.fragment.getData();
    const gif = await sharp(fragmentData).gif().toBuffer();

    return {
      dataType: 'image/gif',
      dataLength: gif.length,
      convertedData: gif,
    };
  }
}

module.exports = PngToGifConverter;
