#!/usr/bin/env node
/* jshint node: true */
'use strict';

(function() {

    var mocha = require('mocha');
    var rimraf = require('rimraf');
    var path = require('path');

    var destCleanup = function(cb) {
        var dest = path.join(__dirname, 'dest/project');

        rimraf(dest, function(err) {
            if (err) {
                console.log(err);
            } else {
                if (cb) cb();
            }
        });
    };

    before(function(done) {
        destCleanup(function() { done(); });
    });

    after(function(done) {
        destCleanup(function() { done(); });
    });

})();