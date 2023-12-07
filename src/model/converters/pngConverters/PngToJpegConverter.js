const Converter = require('../Converter');
const sharp = require('sharp');

class PngToJpegConverter extends Converter {
  constructor(fragment) {
    super(fragment);
  }

  async convert() {
    const fragmentData = await this.fragment.getData();
    const jpg = await sharp(fragmentData).jpeg().toBuffer();

    return {
      dataType: 'image/jpeg',
      dataLength: jpg.length,
      convertedData: jpg,
    };
  }
}

module.exports = PngToJpegConverter;
