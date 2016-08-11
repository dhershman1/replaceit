'use strict';
const fs = require('fs');
const path = require('path');

//Options
// Regex
// Path
// replacement
// async
// loop

//This will go through files and replace strings according to your regex, supports the ability to use a function in the replacement property instead of a string.
//
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
		replaceify(opts.path);
	}

	function replaceify(file) {
		fs.lstat(file, (err, stats) => {
			if (err) throw err;

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
						throw err;
					}

					text = replaceifyText(text, file);
					fs.writeFile(file, text, (err) => {
						if (err) throw err;
					});
				})
			} else if (stats.isDirectory() && opts.loop) {
				fs.readdir(file, (err, files) => {
					if (err) throw err;
					for (var i = 0; i < files.length; i++) {
						replaceify(path.join(file, files[i]));
					}
				});
			}
		});
	}

	function replaceifySync(file) {
		let stats = fs.lstatSync(file);
		//Don't follow symbolic links yo
		if (stats.isSymbolicLink()) return;

		let isFile = stats.isFile();

		if (isFile) {
			let text = fs.readFileSync(file, 'utf-8');

			text = replaceifyText(text, file);

			fs.writeFileSync(file, text);
		} else if (stats.isDirectory() && opts.loop) {
			let files = fs.readdirSync(file);
			for (var i = 0; i < files.length; i++) {
				replaceifySync(path.join(file, file[i]));
			}
		}
	}

	function replaceifyText(text, file) {
		let match = text.match(opts.regex);
		if (!match) return null;
		console.log(opts.regex);
		if (typeof opts.replacement === 'object') {
			return text.replace(opts.regex, matched => {
				return opts.replacement[matched];
			});
		} else {
			return text.replace(opts.regex, opts.replacement);
		}
	}
};
