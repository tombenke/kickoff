#!/usr/bin/env node
/*jshint node: true */
'use strict';

var gulp = require('gulp');
var githubSrc = require('vinyl-github-src');
var buffer = require('vinyl-buffer');
var debug = require('gulp-debug');
var through = require('gulp-through');
var order = require('gulp-order');
var mustache = require('gulp-mustache');
var gulpFilter = require('gulp-filter');
var jsyaml = require('js-yaml');
var extend = require('extend');
var inquirer = require('inquirer');

var verbose = false;

/**
 * TBD.
 * @param  {Object} config   Configuration parameters
 * @param  {bool} verbose    Work in verbose mode if `true`
 */
exports.execute = function( config ) {
    verbose = config.verbose;

    var destination = config.dest; //'./dest'
    var fileOrder = ['.kickoff.yml', '.kickoff.json'];
    var srcRepo = config.src ; //'tombenke/ncli-archetype';
    // var srcDir = ['/home/tombenke/topics/ncli-archetype/**',
    //               '!/home/tombenke/topics/ncli-archetype/.git/',
    //               '!/home/tombenke/topics/ncli-archetype/.git/**'];

    var kickoffFilter = gulpFilter(['.kickoff.yml'], {dot: true});
    var allFilter = gulpFilter(['*', '!.kickoff.yml'], {dot: true});

    githubSrc(srcRepo)
        .pipe(buffer())
        .pipe(order(fileOrder))
        .pipe(kickoffFilter)
        .pipe(through('parseKickoff', function(file, config) {
            if (file.path === '/.kickoff.yml') {
                var kickoff = jsyaml.safeLoad(file.contents.toString());
                inquirer.prompt(kickoff.questions, function(res) {
                        githubSrc(srcRepo)
                            .pipe(buffer())
                            .pipe(allFilter)
                            .pipe(mustache(res))
                            .pipe(through('rmBase', function(file, config) {
                                file.base = '/';
                            }, {})())
                            .pipe(gulp.dest(destination));
                    });
            }
        }, {})());
};