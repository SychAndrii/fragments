const ConversionNotAllowed = require('../../errors/ConversionNotAllowed');
const MdToHtmlConverter = require('./mdConverters/MdToHtmlConverter');
const PngToJpegConverter = require('./pngConverters/PngToJpegConverter');

class ConverterFactory {
  static validConversions = {
    'text/markdown': ['html', 'txt'],
    'text/html': ['txt'],
    'application/json': ['txt'],
    'image/png': ['jpg', 'webp', 'gif'],
    'image/jpeg': ['png', 'webp', 'gif'],
    'image/webp': ['png', 'jpg', 'gif'],
    'image/gif': ['png', 'jpg', 'webp'],
  };

  constructor(fragment, extension) {
    this.fragment = fragment;
    this.extension = extension;
  }

  createConverter() {
    const allowedFormats = this.fragment.formats;
    const fragmentType = this.fragment.type;

    if (!allowedFormats.includes(this.extension)) {
      throw new ConversionNotAllowed(fragmentType, this.extension);
    }

    if (fragmentType == 'text/markdown' && this.extension == 'html') {
      return new MdToHtmlConverter(this.fragment);
    }

    if (fragmentType == 'text/markdown' && this.extension == 'txt') {
      return new MdToHtmlConverter(this.fragment);
    }

    if (fragmentType == 'image/png' && this.extension == 'jpg') {
      return new PngToJpegConverter(this.fragment);
    }

    throw new ConversionNotAllowed(fragmentType, this.extension);
  }
}

module.exports = ConverterFactory;
