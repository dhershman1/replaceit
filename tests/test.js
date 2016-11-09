'use strict';

const expect = require('chai').expect;
const fs = require('fs');
const replaceit = require('../src/index.js');

function writeResults(file, cb) {
	fs.readFile(file, 'utf-8', (err, contents) => {
		if (err) cb(err);
		fs.writeFile('./tests/results.txt', contents, (err) => {
			console.log(contents);
			if (err) cb(err);
			cb();
		});
	});
}

describe('Test Module Systems', function() {
	describe('Sync Tests', function() {
		after(function() {
			fs.writeFileSync('./tests/testfileSync.txt', 'I am a Cool old string and I do cool old stuff');
		});
		it('should trigger sync functionality', function(done) {
			replaceit({
				path: './tests/testfileSync.txt',
				regex: /old/gi,
				replacement: 'new',
				async: false,
				loop: false
			});
			writeResults('./tests/testfileSync.txt', (err, res) => {
				let results = fs.readFileSync('./tests/results.txt', 'utf-8');
				expect(results).to.equal('I am a Cool new string and I do cool new stuff');
				done();
			});
		});

		describe('Async Tests', function() {
			after(function() {
				fs.writeFileSync('./tests/testfileAsync.txt', 'I am a uncool Async fan, I do uncool async stuff');
			});
			it('should trigger async functionality', function(done) {
				replaceit({
					path: './tests/testfileAsync.txt',
					regex: /uncool/gi,
					replacement: 'cool',
					async: true,
					loop: false
				}).then(function() {
					writeResults('./tests/testfileAsync.txt', (err) => {
						if (err) done(err);
						fs.readFile('./tests/results.txt', 'utf-8', (err, content) => {
							if (err) done(err);

							expect(content).to.equal('I am a cool Async fan, I do cool async stuff');
							done();
						});
					});
				});
			});
		});
	});
});