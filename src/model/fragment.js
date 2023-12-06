// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const ConverterFactory = require('./converters/ConverterFactory');

const FragmentNotFound = require('../errors/FragmentNotFound');
// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');
const MimeTypesDoNotMatch = require('../errors/MimeTypesDoNotMatch');

class Fragment {
  static validTypes = [
    `text/plain`,
    `text/markdown`,
    `text/html`,
    `application/json`,
    `image/png`,
    `image/jpeg`,
    `image/webp`,
    `image/gif`,
  ];

  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    const requiredProperties = ['ownerId', 'type'];

    for (let prop of requiredProperties) {
      if (!arguments[0][prop]) {
        throw new Error('Missing required property: ' + prop);
      }
    }

    if (!Fragment.isSupportedType(type)) {
      const err = new Error(`Invalid data type: ${type}!`);
      throw err;
    }

    if (typeof size !== 'number' || isNaN(size)) {
      throw new Error('size must be a number!');
    }

    if (size < 0) {
      throw new Error('size must be positive!');
    }

    if (!id) {
      id = randomUUID();
    }

    if (!created) {
      created = new Date().toISOString();
    }

    if (!updated) {
      updated = new Date().toISOString();
    }

    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
    this.type = type;
    this.size = size;
  }

  static async getConvertedData(fragment, extension) {
    const converterFactory = new ConverterFactory(fragment, extension);
    const converter = converterFactory.createConverter();
    return converter.convert();
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    return await listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const fr = await readFragment(ownerId, id);
    if (!fr) throw new FragmentNotFound(id, ownerId);
    return new Fragment({ ...fr });
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static async delete(ownerId, id) {
    await deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  async save() {
    this.updated = new Date().toISOString();
    await writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    return await readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if (!Buffer.isBuffer(data)) {
      throw new TypeError('Expected data to be of type Buffer');
    }
    await this.validateBuffer(data);

    this.size = data.length;

    await writeFragmentData(this.ownerId, this.id, data);
    await this.save();
  }

  async validateBuffer(data) {
    if (this.type.startsWith('image')) {
      const { fileTypeFromBuffer } = await import('file-type');
      const { mime } = await fileTypeFromBuffer(data);
      if (this.type !== mime) {
        throw new MimeTypesDoNotMatch(this.id, this.type, mime);
      }
    }
    else if (this.type == 'application/json') {
      JSON.parse(data.toString());
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    const { type } = contentType.parse(this.type);
    return type.startsWith('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    const mimeType = this.mimeType;
    return ConverterFactory.validConversions[mimeType];
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    try {
      const parsedContentType = contentType.parse(value);
      return this.validTypes.includes(parsedContentType.type);
    } catch (error) {
      return false;
    }
  }
}

module.exports.Fragment = Fragment;
