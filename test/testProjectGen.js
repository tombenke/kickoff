var spawn = require('child_process').spawn;
var path = require('path');
var async = require('async');
var should = require('should');

var getChecksum = function(ctx, cb) {
    var dirsum = require('dirsum');
    var checksum = require('checksum');

    dirsum.digest(ctx.dest, 'sha1', function(err, hashes) {
        if (err) throw err;
        ctx.result1 = hashes;
        ctx.result2 = checksum(JSON.stringify(hashes, null, 2));
        // console.log(ctx.result1, ctx.result2);
        cb(null, ctx);
    });
};

var runCli = function(ctx, cb) {

    var kickoff = path.resolve('bin/cli.js');
    var child = spawn(kickoff, ctx.cliArgs);
    child.stdout.pipe(process.stdout);
    child.on('close', function() {
        cb(null, ctx);
    });
};

var checkResults = function(ctx, cb) {
    ctx.result1.should.eql(ctx.expected1);
    ctx.result2.should.eql(ctx.expected2);
    cb(null, ctx);
};

describe('Generates a new project from archetype', function() {
    it('Generates project from data file', function(done) {
        var src = 'test/src/project/';
        var dest = 'test/dest/project/';
        var ctx = {
            cliArgs: ['-a', 'test/src/ncli.yml', '-f', src, '-d', dest],
            dest: dest,
            expected1: {
                "files": {
                    ".gitignore": "9193e35d8b7fc33d768461505160c12c96c608bd",
                    "README.md": "f8c8bec34cc115169049f664fafaf7e26e109843",
                    "docs": {
                        "files": {
                            "pageTemplate.html": "c7aa9952c44e228e3144e03d256251eaff01d864"
                        },
                        "hash": "e7760370dfb44b3b5379f5f32cad4b7c5d98550f"
                    }
                },
                "hash": "7d837eb1a5ba16c089d2f0d551267abf7f83656c"
            },
            expected2: "a935809668946fa7d9939a491918c9c081823ce6"
        };

        async.waterfall([
                function(callback) { callback(null, ctx); },
                runCli,
                getChecksum,
                checkResults
            ], function(err, result) {
                if (err) {
                    console.log('ERROR: ', err);
                } else {
                    done();
                }
        });
    });
});