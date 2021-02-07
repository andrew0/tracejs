# tracejs

## Getting started

To contribute to this project, you will need to install Node.js and Yarn. I recommend using nvm (Node Version Manager) to install Node.js on your machine. If you are on Windows, you can download nvm [here](https://github.com/coreybutler/nvm-windows#installation--upgrades), and follow the installation instructions. If you are on Linux/Mac, you can follow the instructions [here](https://github.com/nvm-sh/nvm#installing-and-updating). Once you have nvm installed, you should be able to run the command `nvm install node` to install Node.js. After you have Node.js installed, you can run the command `npm install -g yarn` to install Yarn.

This project is setup as a Yarn monorepo, which means that there are multiple NPM packages. The first package is called `tracejs`, which contains all of the code for running the TRACE model simulations. This package also provides a CLI interface, that allows you to interact with the model code through a REPL. The other package is called `tracejs-vue`. This package contains all of the frontend code, written using Vue.js, and powered our other `tracejs` library.

To build the project, you can run the following commands:

```
# clone project
git clone https://github.com/andrew0/tracejs
cd tracejs

# install dependencies
yarn install

# build the `tracejs` package
yarn build
```

That last command `yarn build` tells yarn to run the script in our root level package.json called "build". If you look at the package.json, you'll notice that this build script is running the command `yarn workspace tracejs build`. This instructs Yarn to look at the package named `tracejs` and run the command for that package. In other words, running `yarn build` at the root level is an alias for running the script named "build" in packages/tracejs/package.json. The same thing could be accomplished by changing directories to package/tracejs, then running `yarn build` there. This will transpile the `tracejs` TypeScript source into JavaScript that can be used by Node.js projects, or in this case, or Vue frontend.

## REPL CLI

After building, you should be able to run the CLI for tracejs by running the command `yarn cli` at the root level. This will open up a REPL, similar to as if you had just run the command `node`, but it will pre-import the tracejs library. If you type "tracejs" into your REPL, you can see all of the library exports.

## Vue frontend

To test the frontend, you can run the command `yarn vue-dev`. Similar to our the build command, this ends up being an alias for `yarn workspace tracejs-vue dev`. This will start a live development server of our frontend code, and will automatically update as you modify the frontend source code.

To build the frontend for release, you can run the command `yarn vue-build`. This will build the frontend code into HTML and JavaScript files that can be placed on any web server. To run a local server of this build, you can change directories to the `packages/tracejs-vue/dist` folder, and run the command `npx http-server`.

## Playground

There is another package in this repo called "playground". This is just a package that you can use to write code that uses the tracejs library to run simulations. To run the code in the playground package, all you have to do is build the tracejs package, then change directories to packages/playground, and run the command `node index.js`.
