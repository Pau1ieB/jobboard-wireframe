# DN Basic Webpage Framework
Using **Node.js**, **Express** and **TypeScript**.

This framework allows you to practice developing basic webpages in HTML, CSS, JavaScript and TypeScript.

What are Web Frameworks? - [mdn web docs](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Web_frameworks)

## Contents
1. [Setting Up your Environment / Dependencies](#1-setting-up-your-environment--dependencies)
    - [Node.Js](#nodejs)
    - [TypeScript](#typescript)
2. [Project Installation](#2-project-installation)
3. [Contents of the Framework](#3-contents-of-the-framework)
    - [JavaScript Example](#javascript-example)
    - [TypeScript Example](#typescript-example)
    - [Other Project Folders / Files](#other-project-folders--files)
4. [How to use the Framework](#4-how-to-use-the-framework)
    - [Starting the Express Server](#starting-the-express-server)
    - [Stopping the Express Server](#stopping-the-express-server)
    - [Adding HTML](#adding-html)
    - [Adding CSS](#adding-css)
    - [Adding JavaScript](#adding-javascript)
    - [Adding TypeScript](#adding-typescript)


## 1. Setting Up Your Environment / Dependencies
### Node.Js
Node.Js must be installed to run this framework.

How to install Node.Js - [Node.js Docs](https://nodejs.dev/en/learn/how-to-install-nodejs/)

To check you have Node.Js installed, run the following command in the terminal.

`node --version`

This should have been installed during **Bootcamp Level 0**.

This framework has been tested with Node.Js Version - **18.17.0**

### TypeScript
TypeScript must be installed to run this framework.

To Install TypeScript globally run the following command:

`npm install -g typescript`

To check you have TypeScript installed, run the following command in the terminal.

`tsc --version`

This framework has been tested with Typescript Version - **5.1.6**

More information on TypeScript - [TypeScript Docs](https://www.typescriptlang.org/docs/)

## 2. Project Installation
After cloning the repository, the projects dependencies will need to be installed. In the root directory of your project, run the following command to install the neccessary packages.

`npm install`

More information on NPM - [Intro to NPM package Manager](https://nodejs.dev/en/learn/an-introduction-to-the-npm-package-manager/)

We advise that you use `Git` to clone this github repository. Alternativly you can download this repo as a `.zip` file through github.

What is Git? - [Getting Started - What is Git?](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F)

How to install Git? - [Getting Started - Installing Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## 3. Contents of the Framework
### JavaScript Example
The JavaScript example shows how elements within the DOM can be referenced and manipulated. This example rotates the Logo in the top left. The  JavaScript code can be seen in the `./local/script.js` file.

Comments are provided in the source for explanation.

### TypeScript Example
The TypeScript example shows how Classes and Objects can be used in TypeScript. This example allows the user to increment the counter value by 1 and reset back to 0.

The TypeScript code can be seen in the `./typescript`. The `counter.ts` file contains a class called `Counter`, which is referenced/used in the `tsscript.ts` file.

Comments are provided in the source for explanation.

### Other Project Folders / Files
#### ./build
This folder contains JavaScript files that have been produced from the TypeScript compiler.
#### ./node_modules
This folder contains all of the installed node packages.
#### ./public
Everything in this folder is made public by the server and can be referenced in your `index.html` file.
#### ./typescript
This folder is used to store TypeScript files and is compiled on server start. JavaScript produced from compiling is stored within the `./build/typescript` folder.
#### ./.gitignore
This file contains a list of files that will be excluded from the projects repository.
#### ./app.ts
This is the main app file that is used by the express server to handle requests.
#### nodemon.json
This file contains configuration for `nodemon`, which is used to restart the server when .ts files are changed.
#### ./package-lock.json
This file contains a detailed list of packages installed in the project.
#### ./package.json
This file contains a list of general information about the project including name, version and dependencies.
#### tsconfig.json
This file contains the TypeScript compiler configuration.


## 4. How to use the Framework
### Starting the Express Server
To start the express server run the following command

`npm start`

This command will compile any TypeScript that has been added to the project within the TypeScript folder and run the Express server. By default the Express server will run on **port 3000**

Once the command has finished running you will see the output `Express Server Running - Port: 3000`. 

Open a browser and navigate to `localhost:3000` and the index page will render.

### Stopping the Express Server
To stop the express server in the terminal press `ctrl + c` and press `y, enter` to Terminate Batch Jobs (Terminate Batch Job may need to be executed twice).

### Adding HTML
HTML can be added to the `index.html` file within the `./public` directory.

### Adding CSS
CSS can be added to the `styles.css` file into the `./public` directory.

New `.css` files added to the `./public` directory must be referenced in your target `.html` file, for example:

`<link rel="stylesheet" type="text/css" href="styles.css">`

### Adding JavaScript
JavaScript can be added to the project by adding a `.js` file into the `./public` directory.

Any JavaScript that you would like to include with your page, must be included as a html script tag. For Example:

`<script src="script.js"></script>`

### Adding TypeScript
TypeScript can be added into the project through the `./typescript` directory.

When running the server the TypeScript is compiled and added to the `./build` directory. Any changes to this directory will be overridden when the compiler re-runs.

Any TypeScript that you would like to include with your page, must be included as a html script tag **with the extension of .js not .ts**.

`<script src="tsscript.js" type="module" defer></script>`