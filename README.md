# Fragments

This repository is used for submission of labs for the cloud course. There are 3 ways you can start 
listening for requests:

- **npm run dev**: starts the server using the pino-pretty logger, which formats the json output from pino logger in a readable way. *debug* level logs from logger will be shown. Will detect any changes made to the code and automatically restart the server.

- **npm run debug**: starts the server using the pino-pretty logger, which formats the json output from pino logger in a readable way. Using this command, you can debug your code with visual studio code debugger (see *.vscode/launch.json* for configuring the settings of the debugger). *debug* level logs from logger will be shown. Will detect any changes made to the code and automatically restart the server.

- **npm start**: starts the server without using pino-pretty. Logs will not be formatted, and will be shown as one-line json. *debug* level logs will not be shown. Will not automatically restart the server when the code is changed.

Configuration files inside of root folder are required for imposing rules of formatting across different developer environments and can be used in CI/CD pipeline:

- **.prettierrc** and **.prettierignore** - are used by *Prettier* extension.
- **cspell.json** - is used by Code Spell Checker.
- **.eslint.js** - is used by ESLint.

There is a command to run eslint: 

**npm run lint** - it will check all the files inside of */src* directory.
