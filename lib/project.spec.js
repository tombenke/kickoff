var spawn = require('child_process').spawn;
var path = require('path');
var async = require('async');
var should = require('should');

var getChecksum = function(ctx, cb) {
    var dirsum = require('dirsum');
    //var checksum = require('checksum');

    dirsum.digest(ctx.dest, 'sha1', function(err, hashes) {
        if (err) throw err;
        ctx.result = hashes;
        console.log('expected: %s', JSON.stringify(ctx.result, null, '    '));
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
    ctx.result.should.eql(ctx.expected);
    cb(null, ctx);
};

var runGenerator = function(config, done) {
    var ctx = {
        cliArgs: ['-a', 'test/src/ncli.yml', '-f', config.src, '-d', config.dest],
        dest: config.dest,
        expected: config.expected 
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
}

describe('Generates a new project from archetype', function() {
    it('Generates project from data file', function(done) {
        this.timeout(50000);
        runGenerator({
            src: 'test/src/project/',
            dest: 'test/dest/project/',
            expected: {
                "files": {
                    ".gitignore": "9193e35d8b7fc33d768461505160c12c96c608bd",
                    "LICENCE.md": "1ce3fa9b882c13a5aa2575b98f5a379f6a00a8bc",
                    "ReadMe.md": "f8c8bec34cc115169049f664fafaf7e26e109843",
                    "config.json": "f2e40e1dc05e86e559e7bf2479fbcf1460da1f64",
                    "data": {
                        "files": {
                            "data.json": "60cce35e64b84ac3ee19a2c386d0268857e26292"
                        },
                        "hash": "ed13eb4043a8646d7a323e8259cbc0e6448defb8"
                    },
                    "docs": {
                        "files": {
                            "new_app-page-template.html": "8739f8b5760fbe491195bd2481d2b702e98bd0ce"
                        },
                        "hash": "9b9b9e4c37ddf6e3413d5dac509c7f5eee64286b"
                    }
                },
                "hash": "9ee95c6aa315c03bb008d09aa466a38214bdab26"
            }
        }, done)
    });
});
