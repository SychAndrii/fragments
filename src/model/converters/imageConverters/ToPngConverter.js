const Converter = require('../Converter');
const sharp = require('sharp');

class ToPngConverter extends Converter {
  constructor(fragment) {
    super(fragment);
  }

  async convert() {
    const fragmentData = await this.fragment.getData();
    const png = await sharp(fragmentData).png().toBuffer();

    return {
      dataType: 'image/png',
      dataLength: png.length,
      convertedData: png,
    };
  }
}

module.exports = ToPngConverter;
