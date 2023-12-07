const ConversionNotAllowed = require('../../errors/ConversionNotAllowed');
const MdToHtmlConverter = require('./textConverters/MdToHtmlConverter');
const ToGifConverter = require('./imageConverters/ToGifConverter');
const ToJpegConverter = require('./imageConverters/ToJpegConverter');
const ToWebpConverter = require('./imageConverters/ToWebpConverter');
const ToPngConverter = require('./imageConverters/ToPngConverter');
const HtmlToTxtConverter = require('./textConverters/HtmlToTxtConverter')
const MdToTxtConverter = require('./textConverters/MdToTxtConverter');
const JsonToTxtConverter = require('./textConverters/JsonToTxtConverter');

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

  static extensionsToConverters = {
    'html': {
      'text/markdown': MdToHtmlConverter
    },
    'txt': {
      'text/html': HtmlToTxtConverter,
      'application/json': JsonToTxtConverter,
      'text/markdown': MdToTxtConverter
    },
    'jpg': ToJpegConverter,
    'webp': ToWebpConverter,
    'gif': ToGifConverter,
    'png': ToPngConverter
  }

  constructor(fragment, extension) {
    this.fragment = fragment;
    this.extension = extension;
  }

  createConverter() {
    this.validateConversion();

    const converter = this.getConverter();
    if (converter) {
      return converter;
    }

    throw new ConversionNotAllowed(this.fragment.type, this.extension);
  }

  validateConversion() {
    const allowedFormats = ConverterFactory.validConversions[this.fragment.type];
    const fragmentType = this.fragment.type;

    if (!allowedFormats.includes(this.extension)) {
      throw new ConversionNotAllowed(fragmentType, this.extension);
    }
  }

  getConverter() {
    const extensionValue = ConverterFactory.extensionsToConverters[this.extension];

    if (!extensionValue) {
      return null;
    }

    if (typeof extensionValue === 'object') {
      const converterClass = extensionValue[this.fragment.type];
      return converterClass ? new converterClass(this.fragment) : null;
    } else {
      return new extensionValue(this.fragment);
    }
  }
}

module.exports = ConverterFactory;