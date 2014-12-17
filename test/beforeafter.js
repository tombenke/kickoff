#!/usr/bin/env node
/* jshint node: true */
'use strict';

(function() {

    var mocha = require('mocha');
    var rimraf = require('rimraf');
    var path = require('path');

    var destCleanup = function(cb) {
        var dest = path.join(__dirname, 'dest/project');

        console.log('destCleanup');
        rimraf(dest, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('rimraf %s', dest);
                if (cb) cb();
            }
        });
    };

    before(function(done) {
        // Nothing to do
        console.log('Prepare for testing');
        destCleanup(function() { done(); });
    });

    after(function(done) {
        // Clean the dest folder
        console.log('Do cleansing after testing');
        destCleanup(function() { done(); });
    });

})();