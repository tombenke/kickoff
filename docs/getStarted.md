# Get Started

## Installation

### Prerequisites:

`kickoff` needs [Node.js](http://nodejs.org/) and [NPM](https://npmjs.org/) installed on the machine, before start installing and using it.

### Installation steps

The `kickoff` tool can be installed as any other node module, but you have to install to the global node_modules folder, so use the `-g` switch to `npm`.

To install `kickoff`, execute the following command:

    $ npm install -g kickoff

To check, whether kickoff is installed successfully, run the following command:

    $ kickoff -V


## Usage of the `kickoff` utility

Check if kickoff is properly installed:

    $ kickoff -h

      Usage: kickoff [options]

      Options:

        -h, --help                       output usage information
        -V, --version                    output the version number
        -v, --verbose                    Verbose mode
        -a, --data-file <path>           Path to the yaml format datafile
        -f, --folder <path>              Path to the source directory
        -s, --src <username/repository>  Git repository
        -d, --dest <dst>                 Destination folder

## Create your first project from a repository

The following command will create a new command line tool project with all the required boilerplace code, unsing the [ncli-archetype](https://github.com/tombenke/ncli-archetype) repository:

    $ kickoff -s tombenke/ncli-archetype -d new_app
    ? The name of the application: new_app
    ? The full name of the author of the application: Tamás Benke
    ? The email address of the author: tombenke@gmail.com
    ? The github account (username) of the author: tombenke

Check the results in the newly created `new_app` directory, and see also how the parameters requested through the console have substituted the mustache parameters in `README.md` and `package.json` files.

In order to learn more about how to use the tool,
read the [documentation](documentation.html) pages.
