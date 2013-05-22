#!/usr/bin/env node

var argv = require('optimist').argv;
var createBadge = require('../');
var fs = require('fs');
var syntaxError = require('syntax-error');

var scale = argv.scale || argv.s;

var infile = argv._.shift() || argv.infile || argv.i || '-';
var instream = infile === '-'
    ? process.stdin
    : fs.createReadStream(infile)
;

var outfile = argv._.shift() || argv.outfile || argv.o || '-';
var outstream = outfile === '-'
    ? process.stdout
    : fs.createWriteStream(outfile)
;

var data = '';
instream.on('data', function (buf) { data += buf });
instream.on('end', function () {
    try {
        var browsers = JSON.parse(data);
    }
    catch (err) {
        var e = syntaxError('(' + data + ')')
        console.error(e || err)
        process.exit(1);
    }
    createBadge(browsers, { scale : scale }).pipe(outstream);
});
