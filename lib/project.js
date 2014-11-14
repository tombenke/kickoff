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

// var vinylFs = require('vinyl-fs');
// var template = require('gulp-template');
// var convert = require('gulp-convert');

var verbose = false;

/**
 * TBD.
 * @param  {Object} config   Configuration parameters
 * @param  {bool} verbose    Work in verbose mode if `true`
 */
exports.execute = function( config, mode ) {
    verbose = mode;

    console.log('execute called with ', config);

    var fileOrder = ['.kickoff.yml', '.kickoff.json'];
    var srcRepo = 'tombenke/ncli-archetype';
    // var srcDir = ['/home/tombenke/topics/ncli-archetype/**',
    //               '!/home/tombenke/topics/ncli-archetype/.git/',
    //               '!/home/tombenke/topics/ncli-archetype/.git/**'];

    var setup = {
        appname: 'kickoff'
    };

    githubSrc(srcRepo)
        .pipe(buffer())
        .pipe(order(fileOrder))
        .pipe(debug({verbose: false}))
        .pipe(mustache(setup))
        .pipe(through('rmBase', function(file, config) {
            file.base = '/';
        }, {})())
        .pipe(gulp.dest('./dest'));

    // gulp.src(srcDir, {buffer: true, dot: true})
    //     .pipe(order(fileOrder))
    //     .pipe(debug({verbose: false}))
    //     .pipe(mustache(setup))
    //     .pipe(gulp.dest('./dest'));
};

