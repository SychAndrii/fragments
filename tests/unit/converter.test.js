const Converter = require("../../src/model/converters/Converter");

describe('Converter class', () => {
    test('constructor', () => {
        const fragment = {};
        const converter = new Converter(fragment);

        expect(converter).toBeDefined();
        expect(converter.fragment).toBe(fragment);
    });

    test('should throw an error when convert method is called directly', async () => {
        const fragment = {};
        const converter = new Converter(fragment);

        await expect(converter.convert()).rejects.toThrow('You must use concrete type of converter!');
    });

    test('should allow inheiritance and overriding the convert method', async () => {
        class TestConverter extends Converter {
            async convert() {
                return 'converted';
            }
        }

        const fragment = {};
        const testConverter = new TestConverter(fragment);

        await expect(testConverter.convert()).resolves.toBe('converted');
    });
});