const request = require('supertest');
const app = require('../../src/app');

const complexMdFile = `# Sample Markdown Document

This is a **sample document** to test the conversion from Markdown to HTML.

## Table of Contents
- [Introduction](#introduction)
- [Image and Link](#image-and-link)
- [Code Block](#code-block)
- [List](#list)
- [Table](#table)
- [Blockquotes](#blockquotes)
- [Conclusion](#conclusion)

## Introduction

Markdown is a lightweight markup language with plain-text formatting syntax. It is widely used for formatting readme files, for writing messages in online discussion forums, and as a text-to-HTML conversion tool.

## Image and Link

Here is an image and a link:

![Sample Image](https://via.placeholder.com/150)

[Click here](https://example.com) to visit a sample link.

## Code Block

Here is a sample code block in Python:

\`\`\`python
def hello_world():
    print("Hello, world!")

hello_world()
\`\`\`
## List

Here is an unordered list:

- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2
- Item 3

And an ordered list:

1. First Item
2. Second Item
3. Third Item

## Table

| Header 1    | Header 2    | Header 3    |
|-------------|-------------|-------------|
| Row 1, Col 1| Row 1, Col 2| Row 1, Col 3|
| Row 2, Col 1| Row 2, Col 2| Row 2, Col 3|
| Row 3, Col 1| Row 3, Col 2| Row 3, Col 3|

## Blockquotes

> This is a blockquote.
>
> It can span multiple lines!

## Conclusion

This is just a simple test document to see how Markdown converts to HTML. Enjoy testing!

---

*Markdown Sample Document*
`;
const complexJSONObject = {
  users: [
    {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
      address: {
        street: 'Baker Street',
        city: 'London',
        postalCode: 'NW1 6XE',
        geo: {
          lat: '51.5237',
          lng: '-0.1585',
        },
      },
      phoneNumbers: ['+44-20-1234-5678', '+44-20-8765-4321'],
      website: 'johndoe.com',
      company: {
        name: 'Doe Enterprises',
        catchPhrase: 'Leadership in Innovation',
        industry: 'IT',
      },
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      address: {
        street: '5th Avenue',
        city: 'New York',
        postalCode: '10001',
        geo: {
          lat: '40.7128',
          lng: '-74.0060',
        },
      },
      phoneNumbers: ['+1-212-123-4567', '+1-212-765-4321'],
      website: 'janesmith.net',
      company: {
        name: 'Smith & Co.',
        catchPhrase: 'Innovate, Integrate, Motivate',
        industry: 'Finance',
      },
    },
  ],
  metadata: {
    timestamp: '2023-10-23T10:00:00Z',
    version: '1.0',
    source: 'Assistant DB',
  },
};
const complexHtmlFile = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complex HTML for Testing</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { margin: 20px; }
        table { width: 100%; border-collapse: collapse; }
        table, th, td { border: 1px solid black; }
        th, td { padding: 10px; text-align: left; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to the Complex HTML Test Page</h1>
        <p>This is a test page filled with various HTML elements to be used for testing purposes.</p>

        <h2>Text Content</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <ul>
            <li>List Item 1</li>
            <li>List Item 2</li>
            <li>List Item 3</li>
        </ul>

        <h2>Images and Links</h2>
        <img src="https://via.placeholder.com/150" alt="Placeholder Image">
        <p>Visit <a href="https://example.com">Example.com</a> for more information.</p>

        <h2>Table</h2>
        <table>
            <tr>
                <th>Header 1</th>
                <th>Header 2</th>
                <th>Header 3</th>
            </tr>
            <tr>
                <td>Data 1</td>
                <td>Data 2</td>
                <td>Data 3</td>
            </tr>
            <tr>
                <td>Data 4</td>
                <td>Data 5</td>
                <td>Data 6</td>
            </tr>
        </table>

        <h2>Form</h2>
        <form action="#">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name"><br><br>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email"><br><br>
            <input type="submit" value="Submit">
        </form>
    </div>
</body>
</html>
`;

describe('GET/:id route', () => {
  describe('Log-in credentials', () => {
    test('Does not allow access for unauthenticated users', async () => {
      const res = await request(app).get('/v1/fragments/123');
      expect(res.statusCode).toBe(401);
    });

    test('Incorrect credentials are denied', async () => {
      const res = await request(app)
        .get('/v1/fragments/123')
        .auth('invalid@email.com', 'incorrect_password');
      expect(res.statusCode).toBe(401);
    });

    test('Authorized users are able to create access route successfully', async () => {
      const res = await request(app).get('/v1/fragments/123').auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('Legal conversions', () => {
    test('Allows to convert from markdown to html', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send(complexMdFile)
        .set('Content-Type', 'text/markdown')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;

      let res = await request(app)
        .get(`/v1/fragments/${createdFragment.id}.html`)
        .auth('user1@email.com', 'password1');

      expect(res.statusCode).toEqual(200);
    });

    test('Correctly converts from markdown to html', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('# Sample Markdown Document')
        .set('Content-Type', 'text/markdown')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;

      let res = await request(app)
        .get(`/v1/fragments/${createdFragment.id}.html`)
        .auth('user1@email.com', 'password1');

      expect(res.text == '<h1>Sample Markdown Document</h1>\n').toBe(true);
    });
  });

  describe('Illegal conversions', () => {
    test('Does not allow illegal text/plain conversions', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('Hello there')
        .set('Content-Type', 'text/plain')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;
      const invalidExtensions = ['png', 'jpg', 'webp', 'gif', 'md', 'html'];

      for (const extension of invalidExtensions) {
        const res = await request(app)
          .get(`/v1/fragments/${createdFragment.id}.${extension}`)
          .auth('user1@email.com', 'password1');

        expect(res.statusCode).toEqual(415);
      }
    });

    test('Does not allow illegal text/markdown conversions', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('# Hello there')
        .set('Content-Type', 'text/markdown')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;
      const invalidExtensions = ['png', 'jpg', 'webp', 'gif', 'md', 'txt'];

      for (const extension of invalidExtensions) {
        const res = await request(app)
          .get(`/v1/fragments/${createdFragment.id}.${extension}`)
          .auth('user1@email.com', 'password1');

        expect(res.statusCode).toEqual(415);
      }
    });

    test('Does not allow illegal text/html conversions', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('<h1>Hello there</h1>')
        .set('Content-Type', 'text/html')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;
      const invalidExtensions = ['png', 'jpg', 'webp', 'gif', 'md', 'html', 'txt'];

      for (const extension of invalidExtensions) {
        const res = await request(app)
          .get(`/v1/fragments/${createdFragment.id}.${extension}`)
          .auth('user1@email.com', 'password1');

        expect(res.statusCode).toEqual(415);
      }
    });

    test('Does not allow illegal application/json conversions', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('{"key": "value"}')
        .set('Content-Type', 'application/json')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;
      const invalidExtensions = ['png', 'jpg', 'webp', 'gif', 'md', 'html', 'txt'];

      for (const extension of invalidExtensions) {
        const res = await request(app)
          .get(`/v1/fragments/${createdFragment.id}.${extension}`)
          .auth('user1@email.com', 'password1');

        expect(res.statusCode).toEqual(415);
      }
    });

    test('Does not allow illegal image/png conversions', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('<h1>Hello there</h1>')
        .set('Content-Type', 'image/png')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;
      const invalidExtensions = ['png', 'jpg', 'webp', 'gif', 'md', 'html', 'txt'];

      for (const extension of invalidExtensions) {
        const res = await request(app)
          .get(`/v1/fragments/${createdFragment.id}.${extension}`)
          .auth('user1@email.com', 'password1');

        expect(res.statusCode).toEqual(415);
      }
    });

    test('Does not allow illegal image/jpeg conversions', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('<h1>Hello there</h1>')
        .set('Content-Type', 'image/jpeg')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;
      const invalidExtensions = ['png', 'jpg', 'webp', 'gif', 'md', 'html', 'txt'];

      for (const extension of invalidExtensions) {
        const res = await request(app)
          .get(`/v1/fragments/${createdFragment.id}.${extension}`)
          .auth('user1@email.com', 'password1');

        expect(res.statusCode).toEqual(415);
      }
    });

    test('Does not allow illegal image/webp conversions', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('<h1>Hello there</h1>')
        .set('Content-Type', 'image/webp')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;
      const invalidExtensions = ['png', 'jpg', 'webp', 'gif', 'md', 'html', 'txt'];

      for (const extension of invalidExtensions) {
        const res = await request(app)
          .get(`/v1/fragments/${createdFragment.id}.${extension}`)
          .auth('user1@email.com', 'password1');

        expect(res.statusCode).toEqual(415);
      }
    });

    test('Does not allow illegal image/gif conversions', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send('<h1>Hello there</h1>')
        .set('Content-Type', 'image/gif')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;
      const invalidExtensions = ['png', 'jpg', 'webp', 'gif', 'md', 'html', 'txt'];

      for (const extension of invalidExtensions) {
        const res = await request(app)
          .get(`/v1/fragments/${createdFragment.id}.${extension}`)
          .auth('user1@email.com', 'password1');

        expect(res.statusCode).toEqual(415);
      }
    });
  });

  describe('Simple retrieval', () => {
    test('Does not allow to get fragment if it does not exist for current user', async () => {
      const res = await request(app).get('/v1/fragments/123').auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(404);
    });

    test('Allows to get fragment if it exists for current user', async () => {
      const postRes = await request(app)
        .post('/v1/fragments')
        .send('This is a fragment')
        .set('Content-Type', 'text/plain')
        .auth('user1@email.com', 'password1');

      const createdFragment = postRes.body.fragment;

      const res = await request(app)
        .get(`/v1/fragments/${createdFragment.id}`)
        .auth('user1@email.com', 'password1');

      expect(res.statusCode).toEqual(200);
    });

    test('Gets correct fragment content if it exists for current user (json)', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send(complexJSONObject)
        .set('Content-Type', 'application/json')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;

      let res = await request(app)
        .get(`/v1/fragments/${createdFragment.id}`)
        .auth('user1@email.com', 'password1');

      expect(res.body).toEqual(complexJSONObject);
      console.log(res.body);
      expect(res.headers['content-type'].startsWith('application/json')).toBe(true);
      expect(+res.headers['content-length']).toBe(JSON.stringify(complexJSONObject).length)
    });

    test('Gets correct fragment content if it exists for current user (html)', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send(complexHtmlFile)
        .set('Content-Type', 'text/html')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;

      let res = await request(app)
        .get(`/v1/fragments/${createdFragment.id}`)
        .auth('user1@email.com', 'password1');

      expect(res.text).toEqual(complexHtmlFile);
      expect(res.headers['content-type'].startsWith('text/html')).toBe(true);
      expect((+res.headers['content-length'])).toBe(complexHtmlFile.length)
    });

    test('Gets correct fragment content if it exists for current user (markdown)', async () => {
      let postRes = await request(app)
        .post('/v1/fragments')
        .send(complexMdFile)
        .set('Content-Type', 'text/markdown')
        .auth('user1@email.com', 'password1');

      let createdFragment = postRes.body.fragment;

      let res = await request(app)
        .get(`/v1/fragments/${createdFragment.id}`)
        .auth('user1@email.com', 'password1');

      console.log(res.headers);

      expect(res.text).toEqual(complexMdFile);
      expect(res.headers['content-type'].startsWith('text/markdown')).toBe(true);
      expect(res.headers['content-length']).toEqual(complexMdFile.length)
    });
  });

  describe('Reponse structure', () => {
    test('In case of success, returns response of correct structure', async () => {
      const res = await request(app).get('/v1/fragments/123').auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(404);
    });

    test('In case of error, returns response of correct structure', async () => {
      const res = await request(app).get('/v1/fragments/123').auth('user1@email.com', 'password1');
      expect(res.body.status == 'error').toBe(true);
      expect(typeof res.body.error.code == 'number').toBe(true);
      expect(typeof res.body.error.message == 'string').toBe(true);
    });
  });
});
