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
        .description('kickoff - creates boilerplates from Github repo or local folder')
        .option("-v, --verbose", "Verbose mode", Boolean, false)
        .option("-a, --data-file <path>", "Path to the yaml format datafile", String, null)
        .option("-f, --folder <path>", "Path to the source directory", String, null)
        .option("-s, --src <username/repository>", "Git repository", String, 'tombenke/ncli-archetype')
        .option("-d, --dest <dst>", "Destination folder", String, './new_project');

    program.parse(process.argv);

    if (program.folder) {
        app.project.executeFromFolder({
                dataFile: program.dataFile,
                src: program.folder,
                dest: program.dest
            }, program.verbose);
    } else if (program.src) {
        app.project.executeFromGit({
                dataFile: program.dataFile,
                src: program.src,
                dest: program.dest
            }, program.verbose);
    } else {
        console.log('You must define source with either -f or -s.');
    }
})();
