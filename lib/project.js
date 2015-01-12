#!/usr/bin/env node
/*jshint node: true */
'use strict';

var gulp = require('gulp');
var githubSrc = require('vinyl-github-src');
var buffer = require('vinyl-buffer');
var debug = require('gulp-debug');
var through = require('gulp-through');
var mustache = require('mustache');
// var gulpMustache = require('gulp-mustache');
var gulpMustache = require('gulp-handlebars');
var handlebars = require('handlebars');
var gulpFilter = require('gulp-filter');
var jsyaml = require('js-yaml');
var inquirer = require('inquirer');
var path = require('path');
var async = require('async');
var fs = require('fs');
var extend = require('extend');
var _ = require('underscore');

var verbose = false;

var defaultKickoff = {
    description: '',
    welcome: '',
    postscript: '',
    converters: {
        mustaches: [],
        handlebars: [],
        plugins: []
    },
    questions: [],
    fileNames: []
};

var getInquery = function(ctx, callback) {
    ctx.srcStream()
        .pipe(buffer())
        .pipe(gulpFilter(['.kickoff.yml'], {dot: true}))
        .pipe(through('parseKickoff', function(file, config) {
            if (file.path.match(/\.kickoff.yml$/)) {
                ctx.kickoff = extend(defaultKickoff, jsyaml.safeLoad(file.contents.toString()));
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
        // console.log('ctx.data: ', ctx.data);
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

var converter = function(ctx) {
    return function(file, config) {
        var fileName = file.path.split(file.base)[1].replace(/^\//,'');
        // console.log('converters: ', ctx.kickoff.converters);

        if (_.indexOf(ctx.kickoff.converters.handlebars, fileName) >= 0) {
            console.log('Converting %s as Handlebars template', fileName);
            file.contents = new Buffer(handlebars.compile(String(file.contents))(ctx.data));
        } else if (_.indexOf(ctx.kickoff.converters.mustache, fileName) >= 0) {
            console.log('Converting %s as Mustache template', fileName);
            file.contents = new Buffer(mustache.render(String(file.contents), ctx.data));
        } else if (_.indexOf(ctx.kickoff.converters.plugin, fileName) >= 0) {
            console.log('Converting %s as a JavaScript plugin', fileName);
            file.contents = new Buffer(require(file.path)(String(file.contents), ctx.data));
        }
    };
};



var fileRename = function(ctx) {
    return function(file, config) {
        var fileName = file.path.split(file.base)[1].replace(new RegExp("^" + path.sep),'');
        var newName = ctx.fileRename[fileName];
        if (newName && newName.length > 0) {
            file.path = file.base + '/' + newName;
        }
    };
};

// var fileRename = function(ctx) {
//     return function(file, config) {
//         var fileName = path.basename(file.path);
//         var newName = ctx.fileRename[fileName];
//         console.log(ctx.fileRename);
//         if (newName && newName.length > 0) {
//             file.path = file.base + '/' + newName;
//         }
//     };
// };

var processFiles = function(ctx, callback) {
    var allFilter = gulpFilter(['**', '!.kickoff.yml'], {dot: true});
    ctx.srcStream()
        .pipe(buffer())
        .pipe(allFilter)
        // .pipe(gulpMustache(ctx.data))
        .pipe(through('converter', converter(ctx), {})())
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