## About

'kickoff' is a Command-Line application using Node.js.

This tool can be used to easily create boilerplate code for new projects and other things based on archetypes stored in GitHub repos.

1. Install kickoff in global mode.
2. Create the repository on github for the project template, including mustache templates.
3. Place the .kickoff.yml file,
   to define the questionnaire for collecting parameter values for template files.

## Installation

Run the install command:

    npm install -g kickoff

Check if kickoff is properly installed:

    $ kickoff -h

      Usage: kickoff [options]

      Options:

        -h, --help                       output usage information
        -V, --version                    output the version number
        -v, --verbose                    Verbose mode
        -s, --src <username/repository>  Git repository
        -d, --dest <dst>                 Destination folder

## Create the repository on github for the project template

This is a normal repository, which can contain anything.
These files will be copied to the destination folder without modification.
During this transfer, each file is processed by the mustache template engine, so you can place parameters into these files, which will be replaced by actual values, you can define through the command line interface of the tool.

The enquery for these parameters can be defined in the `.kickoff.yml` file, that you can place in the root of the repository.

See [ncli-archetype](https://github.com/tombenke/ncli-archetype) repository on GitHub, that is a Project archetype for Command Line tools using Node.js.

## Create your first project from an existing template repository

The following command will create a new command line tool project with all the required boilerplace code, unsing the [ncli-archetype](https://github.com/tombenke/ncli-archetype) repository:

    $ kickoff -s tombenke/ncli-archetype -d new_app
    ? The name of the application: new_app
    ? The full name of the author of the application: Tamás Benke
    ? The email address of the author: tombenke@gmail.com
    ? The github account (username) of the author: tombenke

Check how the parameters requested through the console will substitute the mustache parameters in `README.md` and `package.json` files.

# The .kickoff.yml configuration file

This is a sample configuration file for the kickoff utility:

    questions:
        - 
            type: input
            name: appname
            message: The name of the application
            default: anonymous
        -
            type: input
            name: author_full_name
            message: The full name of the author of the application
            default: Anonymous

        -
            type: input
            name: author_email
            message: The email address of the author
            default: anonymous@some-domain.com

        -
            type: input
            name: author_github_account
            message: The github account (username) of the author
            default: anonymous

You can add as many parameters as you need, using the same names you put into the mustache templates.

To learn more about the tool visit the [homepage](http://tombenke.github.io/kickoff/).
