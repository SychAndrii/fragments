const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
} = require('../../src/model/data/memory/');
const { Buffer } = require('node:buffer');

describe('fragments API', () => {
  let fragment;
  let buf;
  let authorId = '5';
  let fragmentId = '10';

  beforeEach(async () => {
    authorId = '5';
    fragmentId = '10';
    fragment = {
      ownerId: '5',
      id: '10',
      data: {
        name: 'Andrii Sych',
        age: 19,
      },
    };
    buf = Buffer.from('Hello World!', 'utf-8');
  });

  test('writeFragment does not modify a fragment which was written to the database', async () => {
    await writeFragment(fragment);
    expect(fragment).toEqual(fragment);
  });

  test('writeFragment overwrites a fragment with the same ownerId and fragment id', async () => {
    await writeFragment(fragment);
    const anotherFragment = {
      ...fragment,
      data: {
        value: 'absolutely new data',
      },
    };

    await writeFragment(anotherFragment);
    const gotFragment = await readFragment('5', '10');
    expect(gotFragment).toEqual(anotherFragment);
  });

  test('writeFragment does not overwrite a fragment for the same ownerId if it has different fragment id', async () => {
    await writeFragment(fragment);
    const anotherFragment = {
      ...fragment,
      id: (+fragment.id + 5).toString(),
      data: {
        value: 'absolutely new data',
      },
    };

    await writeFragment(anotherFragment);
    const firstFragment = await readFragment('5', '10');
    const secondFragment = await readFragment('5', '15');
    expect(firstFragment).toEqual(fragment);
    expect(secondFragment).toEqual(anotherFragment);
  });

  test('writeFragment does not overwrite a fragment if it has different ownerId', async () => {
    await writeFragment(fragment);
    const anotherFragment = {
      ...fragment,
      ownerId: (+fragment.ownerId + 5).toString(),
      data: {
        value: 'absolutely new data',
      },
    };

    await writeFragment(anotherFragment);
    const firstFragment = await readFragment('5', '10');
    const secondFragment = await readFragment('10', '10');
    expect(firstFragment).toEqual(fragment);
    expect(secondFragment).toEqual(anotherFragment);
  });

  test('writeFragment throws an error if it accepts invalid ids', async () => {
    const asyncFunction = async () => {
      await writeFragment({
        ...fragment,
        id: {
          object: 'my object',
        },
        ownerId: 123,
      });
    };

    await expect(asyncFunction()).rejects.toThrow();
  });

  test('readFragment can find a fragment which was written to the database', async () => {
    await writeFragment(fragment);
    const gotFragment = await readFragment('5', '10');
    expect(gotFragment).toEqual(fragment);
  });

  test('readFragment returns undefined if it cannot find a fragment in the database', async () => {
    const gotFragment = await readFragment('5', '999');
    expect(gotFragment).toEqual(undefined);
  });

  test('readFragment throws an error if it accepts invalid ids', async () => {
    const asyncFunction = async () => {
      await readFragment(
        {
          key: 12,
        },
        {
          value: 123,
        }
      );
    };

    await expect(asyncFunction()).rejects.toThrow();
  });

  test('writeFragmentData does not modify a buffer which was written to the database', async () => {
    await writeFragmentData(authorId, fragmentId, buf);
    expect(buf).toEqual(buf);
  });

  test('writeFragmentData overwrites a buffer with the same ownerId and fragment id', async () => {
    await writeFragmentData(authorId, fragmentId, buf);
    const anotherBuffer = Buffer.from('Bye, World!', 'utf-8');
    await writeFragmentData(authorId, fragmentId, anotherBuffer);

    const res = await readFragmentData('5', '10');
    expect(res).toEqual(anotherBuffer);
  });

  test('writeFragmentData does not overwrite a buffer for the same ownerId if it has different fragment id', async () => {
    await writeFragmentData(authorId, fragmentId, buf);
    const anotherBuffer = Buffer.from('Bye, World!', 'utf-8');
    await writeFragmentData(authorId, (+fragmentId + 5).toString(), anotherBuffer);

    const initialBuf = await readFragmentData('5', '10');
    expect(initialBuf).toEqual(buf);
    const secondBuf = await readFragmentData('5', '15');
    expect(secondBuf).toEqual(anotherBuffer);
  });

  test('writeFragmentData does not overwrite a fragment if it has different ownerId', async () => {
    await writeFragmentData(authorId, fragmentId, buf);
    const anotherBuffer = Buffer.from('Bye, World!', 'utf-8');
    await writeFragmentData((+authorId + 1).toString(), fragmentId, anotherBuffer);

    const firstFragmentData = await readFragmentData('5', '10');
    const secondFragmentData = await readFragmentData('6', '10');
    expect(firstFragmentData).toEqual(buf);
    expect(secondFragmentData).toEqual(anotherBuffer);
  });

  test('writeFragmentData can work with buffers', async () => {
    await writeFragmentData('5', '10', buf);
  });

  test('writeFragmentData can work with objects', async () => {
    await writeFragmentData('5', '10', fragment);
  });

  test('writeFragmentData throws an error if it accepts invalid ids', async () => {
    const asyncFunction = async () => {
      await writeFragment(12, 23, buf);
    };

    await expect(asyncFunction()).rejects.toThrow();
  });

  test('readFragmentData can find a buffer which was written to the database', async () => {
    await writeFragmentData(authorId, fragmentId, buf);
    const gotFragmentData = await readFragmentData(authorId, fragmentId);
    expect(gotFragmentData).toEqual(buf);
  });

  test('readFragmentData throws an error if it accepts invalid ids', async () => {
    const asyncFunction = async () => {
      await readFragmentData(12, 23);
    };

    await expect(asyncFunction()).rejects.toThrow();
  });

  test('readFragmentData returns undefined if it cannot find a buffer in the database', async () => {
    const gotFragmentData = await readFragmentData('5', '999');
    expect(gotFragmentData).toEqual(undefined);
  });
});
