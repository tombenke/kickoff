#!/usr/bin/env node
/*jshint node: true */
'use strict';

/**
 * command-line utility
 */
(function() {
    var verbose = false;
    var program = require('commander');
    var thisPackage = require(__dirname + '/../package.json');
    program._name = thisPackage.name;
    var app = require('../index');

    // Setup the commands of the program
    program
        .version(thisPackage.version)
        .command('project')
        .description('Execute the "project" command with the following parameters')
        .option("-v, --verbose", "Verbose mode", Boolean, false)
        .option("-s, --src <username/repository>", "Git repository", String, 'tombenke/ncli-archetype')
        .option("-d, --dest <dst>", "Destination folder", String, './new_project')
        .action(function(options) {
                verbose = options.verbose;
                app.project.execute({
                        src: options.src,
                        dest: options.dest
                    }, verbose);
                });
    program.parse(process.argv);
})();