const ConversionNotAllowed = require('../../errors/ConversionNotAllowed')
const MdToHtmlConverter = require('./MdToHtmlConverter');

class ConverterFactory {
  static validConversions = {
    'text/plain': ['txt'],
    'text/markdown': ['md', 'html', 'txt'],
    'text/html': ['html', 'txt'],
    'application/json': ['json', 'txt'],
    'image/png': ['png', 'jpg', 'webp', 'gif'],
    'image/jpeg': ['png', 'jpg', 'webp', 'gif'],
    'image/webp': ['png', 'jpg', 'webp', 'gif'],
    'image/gif': ['png', 'jpg', 'webp', 'gif'],
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

    if(fragmentType == 'text/markdown' && this.extension == 'html') {
        return new MdToHtmlConverter(this.fragment);
    }
    
    throw new ConversionNotAllowed(fragmentType, this.extension);
  }
}

module.exports = ConverterFactory;