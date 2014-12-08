#!/usr/bin/env node
/*jshint node: true */
'use strict';

var gulp = require('gulp');
var githubSrc = require('vinyl-github-src');
var buffer = require('vinyl-buffer');
var debug = require('gulp-debug');
var through = require('gulp-through');
var mustache = require('gulp-mustache');
var gulpFilter = require('gulp-filter');
var jsyaml = require('js-yaml');
var extend = require('extend');
var inquirer = require('inquirer');
var path = require('path');

var verbose = false;

/**
 * TBD.
 * @param  {Object} config   Configuration parameters
 * @param  {bool} verbose    Work in verbose mode if `true`
 */
exports.executeFromGit = function( config ) {
    verbose = config.verbose;

    //src = 'tombenke/ncli-archetype';
    config.base = '/';
    return execute( config, function() {
            return githubSrc(config.src);
        });
};

exports.executeFromFolder = function( config ) {
    verbose = config.verbose;
    var src = path.resolve(config.src);
    config.base = src;

    // var src = ['/home/tombenke/topics/ncli-archetype/**',
    //            '!/home/tombenke/topics/ncli-archetype/.git/',
    //            '!/home/tombenke/topics/ncli-archetype/.git/**'];
    console.log('executeFromFolder ', config);
    return execute( config, function() {
        return gulp.src([
            src + '/**',
            '!' + src + '/.git/',
            '!' + src + '/.git/**' ],
            {
                base: src,
                dot: true
            });
        });
};

var execute = function( config, srcStream ) {
    var kickoffFilter = gulpFilter(['.kickoff.yml'], {dot: true});
    var allFilter = gulpFilter(['**', '!.kickoff.yml'], {dot: true});
    var destination = config.dest;
    var base = config.base;

    srcStream()
        .pipe(buffer())
        .pipe(kickoffFilter)
        .pipe(through('parseKickoff', function(file, config) {
            if (file.path.match(/\.kickoff.yml$/)) {
                var kickoff = jsyaml.safeLoad(file.contents.toString());
                var welcome = kickoff.welcome || '';
                var postscript = kickoff.postscript || 'Succesfully finished.';

                console.log(welcome);
                inquirer.prompt(kickoff.questions, function(res) {

                        srcStream()
                            .pipe(buffer())
                            .pipe(allFilter)
                            .pipe(debug())
                            .pipe(mustache(res))
                            .pipe(through('rmBase', function(file, config) {
                                file.base = base;
                            }, {})())
                            .pipe(gulp.dest(path.resolve(destination)))
                            .on('finish', function() {
                                    console.log(postscript);
                                });
                    });
            }
        }, {})());
};