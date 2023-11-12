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

module.exports = {
    complexHtmlFile,
    complexJSONObject,
    complexMdFile
};