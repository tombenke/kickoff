#!/usr/bin/env node
/*jshint node: true */
'use strict';

/**
 * command-line utility
 */
(function() {
    var program = require('commander');
    var thisPackage = require(__dirname + '/../package.json');
    program._name = thisPackage.name;
    var app = require('../index');

    program
        .version(thisPackage.version)
        .description('Execute the "project" command with the following parameters')
        .option("-v, --verbose", "Verbose mode", Boolean, false)
        .option("-s, --src <username/repository>", "Git repository", String, 'tombenke/ncli-archetype')
        .option("-d, --dest <dst>", "Destination folder", String, './new_project');

    program.parse(process.argv);

    app.project.execute({
            src: program.src,
            dest: program.dest
        }, program.verbose);
})();