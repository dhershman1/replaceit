'use strict';

const fs = require('fs');
const path = require('path');

module.exports = (options) => {
	if (!options.regex || !options.replacement || !options.path) {
		return console.error('No Regex or Replacement Provided');
	}
	let defaults = {
		loop: false,
		async: true
	};

	let opts = Object.assign({}, defaults, options);

	if (!opts.async) {
		replaceifySync(opts.path);
	} else {
		return replaceify(opts.path);
	}

	function replaceify(file) {
		return new Promise((resolve, reject) => {
			fs.lstat(file, (err, stats) => {
				if (err) reject(err);

				//Don't follow symbolic links yo
				if (stats.isSymbolicLink()) return;

				let isFile = stats.isFile();
				if (isFile) {
					fs.readFile(file, 'utf-8', (err, text) => {
						if (err) {
							if (err.code === 'EMFILE') {
								console.log('Too many files, try running again without async');
								process.exit(1);
							}
							reject(err);
						}

						text = replaceifyText(text);
						fs.writeFile(file, text, (err) => {
							if (err)  reject(err);
							resolve();
						});
					});
				} else if (stats.isDirectory() && opts.loop) {
					fs.readdir(file, (err, files) => {
						if (err) reject(err);
						for (var i = 0; i < files.length; i++) {
							replaceify(path.join(file, files[i]));
						}
					});
				}
			});
		});

	}

	function replaceifySync(file) {
		let stats = fs.lstatSync(file);
		//Don't follow symbolic links yo
		if (stats.isSymbolicLink()) return;

		let isFile = stats.isFile();
		if (isFile) {
			let text = fs.readFileSync(file, 'utf-8');

			text = replaceifyText(text);

			fs.writeFileSync(file, text);
		} else if (stats.isDirectory() && opts.loop) {
			let files = fs.readdirSync(file);
			for (var i = 0; i < files.length; i++) {
				replaceifySync(path.join(file, files[i]));
			}
		}
	}

	function replaceifyText(text) {
		let match = text.match(opts.regex);
		if (!match) return null;
		if (typeof opts.replacement === 'object') {
			return text.replace(opts.regex, matched => {
				return opts.replacement[matched];
			});
		} else {
			return text.replace(opts.regex, opts.replacement);
		}
	}
};
