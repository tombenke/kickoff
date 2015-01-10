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
        console.log('expected1: %s', JSON.stringify(ctx.result1, null, '    '));
        console.log('expected2: "%s"', ctx.result2);
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
        this.timeout(50000);
        var src = 'test/src/project/';
        var dest = 'test/dest/project/';
        var ctx = {
            cliArgs: ['-a', 'test/src/ncli.yml', '-f', src, '-d', dest],
            dest: dest,
            expected1: {
                "files": {
                    ".gitignore": "9193e35d8b7fc33d768461505160c12c96c608bd",
                    "LICENCE.md": "1ce3fa9b882c13a5aa2575b98f5a379f6a00a8bc",
                    "ReadMe.md": "f8c8bec34cc115169049f664fafaf7e26e109843",
                    "config.json": "9e0cc0cf16dddd314145fd1579426b7f78fe3f93",
                    "data": {
                        "files": {
                            "data.json": "60cce35e64b84ac3ee19a2c386d0268857e26292"
                        },
                        "hash": "ed13eb4043a8646d7a323e8259cbc0e6448defb8"
                    },
                    "docs": {
                        "files": {
                            "new_app-page-template.html": "c7aa9952c44e228e3144e03d256251eaff01d864"
                        },
                        "hash": "e7760370dfb44b3b5379f5f32cad4b7c5d98550f"
                    }
                },
                "hash": "7711f2c6432cc82d5d8b80ab5d5a9d27ad28dcf8"
            }, 
            expected2:  "fea38eaaadb8c44bfac44e53f9a29de8d97f0050"
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