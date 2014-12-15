Documentation
=============

## Installation

The prerequisites and installation of the tool is described in the [Get Started](getStarted.html) page.

## Create the template repository

This is a normal repository, which can contain anything, including mustache templates.
These files will be copied to the destination folder without modification.
During this transfer, each file is processed by the mustache template engine, so you can place parameters into these files, which will be replaced by actual values, that you can define through the command line interface of the tool.

The enquiry for these parameters can be described in the `.kickoff.yml` file, that you can place into the root of the repository.

See [ncli-archetype](https://github.com/tombenke/ncli-archetype) repository on GitHub, that is a Project archetype for Command Line tools using Node.js.

# The `.kickoff.yml` file 

You can describe the questionnaire for template parameters within the `.kickoff.yml` file.

This is a sample configuration file for the `kickoff` utility:

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

##  Load the context data from YAML file instead of querying

Let's suppose, you create a `new_app` executing the following command:

    $ kickoff -s tombenke/ncli-archetype -d new_app
    ? The name of the application: new_app
    ? The full name of the author of the application: Tamás Benke
    ? The email address of the author: tombenke@gmail.com
    ? The github account (username) of the author: tombenke

You can achive the same result, if you create a YAML file (for example: `desc.yml`), with the following content:

    appname: new_app
    author_full_name: Tamás Benke
    author_email: tombenke@gmail.com
    author_github_account: tombenke

With the `-a, --data-file` argument, you can load the context data in the YAML format file instead of using the interactive inquery via the console, so execute the next command:

    $ kickoff -a ncli.yml -s tombenke/ncli-archetype -d new_app

The result will be something similar to this:

    You are generating a JavaScript project, which is  using node.js, and running as a command-line application. 

    Loading data from ncli.yml instead of querying...

    Next steps:

     - Install the npm modules required by the newly generated application:

        cd <dest-folder>
        npm install

This method can be used, if the volume of the context data is big, and/or it has a complex structure (nested arrays and objects, etc.).
