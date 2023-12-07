const Converter = require('../Converter');
const sharp = require('sharp');

class ToWebpConverter extends Converter {
  constructor(fragment) {
    super(fragment);
  }

  async convert() {
    const fragmentData = await this.fragment.getData();
    const webp = await sharp(fragmentData).webp().toBuffer();

    return {
      dataType: 'image/webp',
      dataLength: webp.length,
      convertedData: webp,
    };
  }
}

module.exports = ToWebpConverter;
