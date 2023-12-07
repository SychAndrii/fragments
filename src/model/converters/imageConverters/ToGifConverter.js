const Converter = require('../Converter');
const sharp = require('sharp');

class ToGifConverter extends Converter {
  constructor(fragment) {
    super(fragment);
  }

  async convert() {
    const fragmentData = await this.fragment.getData();
    const gif = await sharp(fragmentData, {animated: true}).gif().toBuffer();

    return {
      dataType: 'image/gif',
      dataLength: gif.length,
      convertedData: gif,
    };
  }
}

module.exports = ToGifConverter;
