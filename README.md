## About

'kickoff' is a Command-Line tool, which can be used to easily create boilerplate code for new projects and other things based on archetypes stored in GitHub repos or in local directories.

1. Install kickoff in global mode.
2. Create the source files in a local folder or in a repository on github
   for the project template, including mustache templates.
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
        -a, --data-file <path>           Path to the yaml format datafile
        -f, --folder <path>              Path to the source directory
        -s, --src <username/repository>  Git repository
        -d, --dest <dst>                 Destination folder


## Create the repository on GitHub for the project template

This is a normal repository, which can contain anything, including mustache templates.
These files will be copied to the destination folder without modification.
During this transfer, each file is processed by the mustache template engine, so you can place parameters into these files, which will be replaced by actual values, that you can define through the command line interface of the tool.

The enquiry for these parameters can be described in the `.kickoff.yml` file, that you can place into the root of the repository.

See [ncli-archetype](https://github.com/tombenke/ncli-archetype) repository on GitHub, that is a Project archetype for Command Line tools using Node.js.

## Create your first project from an existing template repository

The following command will create a new command line tool project with all the required boilerplace code, using the [ncli-archetype](https://github.com/tombenke/ncli-archetype) repository:

    $ kickoff -s tombenke/ncli-archetype -d new_app
    ? The name of the application: new_app
    ? The full name of the author of the application: Tamás Benke
    ? The email address of the author: tombenke@gmail.com
    ? The github account (username) of the author: tombenke

Check how the parameters requested through the console will substitute the mustache parameters in `README.md` and `package.json` files.

# The .kickoff.yml configuration file

This is a sample configuration file for the kickoff utility:

    description: |
        This is a project archetype for node.js based, cli applications.
        New projects can be generated from this archetype by the
        [kickoff](https://github.com/tombenke/kickoff) utility.

    welcome: >

        You are generating a JavaScript project, which is 
        using node.js, and running as a command-line application. 

    postscript: >

        Next steps:

         - Install the npm modules required by the newly generated application:

            cd <dest-folder>
            npm install


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

