#!/usr/bin/env node
/*jshint node: true */
'use strict';

var gulp = require('gulp');
var githubSrc = require('vinyl-github-src');
var buffer = require('vinyl-buffer');
var debug = require('gulp-debug');
var through = require('gulp-through');
var mustache = require('mustache');
var gulpMustache = require('gulp-mustache');
var gulpFilter = require('gulp-filter');
var jsyaml = require('js-yaml');
var inquirer = require('inquirer');
var path = require('path');
var async = require('async');
var fs = require('fs');
var extend = require('extend');

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

var setDataDefaults = function(origData, questions) {

    var defaults = {};
    questions.forEach(function(question) {
        if (! defaults.hasOwnProperty(question.name)) {
            defaults[question.name] = question.default;
        }
    });

    var data = extend(true, {}, defaults, origData);
    return data;
};

var getData = function(ctx, callback) {

    console.log(ctx.kickoff.welcome || '');
    if (ctx.dataFile===null) {
        inquirer.prompt(ctx.kickoff.questions, function(res) {
            ctx.data = res;
            callback(null, ctx);
        });
    } else {
        console.log('Loading data from %s instead of querying...', ctx.dataFile);
        var data = jsyaml.safeLoad(fs.readFileSync(ctx.dataFile, 'utf8'));
        ctx.data = setDataDefaults(data, ctx.kickoff.questions);
        callback(null, ctx);
    }
};

var prepareFilenames = function(ctx, callback) {
    ctx.fileRename = {};
    ctx.kickoff.fileNames.forEach(function(filename) {
        filename.to = mustache.render(filename.to, ctx.data);
        console.log('Will replace filename "%s" with "%s".', filename.from, filename.to);
        ctx.fileRename[filename.from] = filename.to;
    });
    callback(null, ctx);
};

var fileRename = function(ctx) {
    return function(file, config) {
        var fileName = file.path.split(file.base)[1].replace(/^\//,'');
        var newName = ctx.fileRename[fileName];
        if (newName && newName.length > 0) {
            file.path = file.base + '/' + newName;
        }
    };
};

var processFiles = function(ctx, callback) {
    var allFilter = gulpFilter(['**', '!.kickoff.yml'], {dot: true});
    ctx.srcStream()
        .pipe(buffer())
        .pipe(allFilter)
        .pipe(gulpMustache(ctx.data))
        .pipe(through('rmBase', function(file, config) {
            file.base = ctx.base;
        }, {})())
        .pipe(through('renameFile', fileRename(ctx), {})())
        .pipe(gulp.dest(path.resolve(ctx.dest)))
        .on('finish', function() {
                console.log(ctx.kickoff.postscript || 'Succesfully finished.');
                callback(null, {});
            });
};

var execute = function(ctx, srcStream) {
    ctx.srcStream = srcStream;

    async.waterfall([
            function(callback) { callback(null, ctx); },
            getInquery,
            getData,
            prepareFilenames,
            processFiles
        ], function(err, result) {
            if (err) {
                console.log('ERROR: ', err);
            }
    });
};

exports.executeFromGit = function(config) {
    verbose = config.verbose;

    config.base = '/';
    return execute( config, function() {
            return githubSrc(config.src);
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