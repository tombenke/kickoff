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