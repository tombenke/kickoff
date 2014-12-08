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
var async = require('async');

var verbose = false;

var getInquery = function(ctx, callback) {
    ctx.srcStream()
        .pipe(buffer())
        .pipe(gulpFilter(['.kickoff.yml'], {dot: true}))
        .pipe(through('parseKickoff', function(file, config) {
            if (file.path.match(/\.kickoff.yml$/)) {
                ctx.kickoff = jsyaml.safeLoad(file.contents.toString());
                callback(null, ctx);
            } else {
                callback({ msg: 'Did not find .kickoff.yml'});
            }
        }, {})());
};

var getData = function(ctx, callback) {

    console.log(ctx.kickoff.welcome || '');
    inquirer.prompt(ctx.kickoff.questions, function(res) {
        ctx.data = res;
        callback(null, ctx);
    });
};

var processFiles = function(ctx, callback) {
    var allFilter = gulpFilter(['**', '!.kickoff.yml'], {dot: true});
    ctx.srcStream()
        .pipe(buffer())
        .pipe(allFilter)
        // .pipe(debug())
        .pipe(mustache(ctx.data))
        .pipe(through('rmBase', function(file, config) {
            file.base = ctx.base;
        }, {})())
        .pipe(gulp.dest(path.resolve(ctx.dest)))
        .on('finish', function() {
                console.log(ctx.kickoff.postscript || 'Succesfully finished.');
                callback(null, {});
            });
};

exports.executeFromGit = function(config) {
    verbose = config.verbose;

    config.base = '/';
    return execute( config, function() {
            return githubSrc(config.src);
        });
};

var execute = function(ctx, srcStream) {
    ctx.srcStream = srcStream;

    async.waterfall([
            function(callback) { callback(null, ctx); },
            getInquery,
            getData,
            processFiles 
        ], function(err, result) {
            if (err) {
                console.log('ERROR: ', err);
            }
    });
};

exports.executeFromFolder = function(config) {
    verbose = config.verbose;
    var src = path.resolve(config.src);
    config.base = src;

    return execute(config, function() {
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