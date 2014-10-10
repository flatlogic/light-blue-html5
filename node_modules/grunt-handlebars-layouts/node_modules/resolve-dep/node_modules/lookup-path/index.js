/*!
 * lookup-path <https://github.com/jonschlinkert/lookup-path>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var debug = require('debug')('lookup-path');
var isAbsolute = require('is-absolute');


/**
 * **Example:**
 *
 * ```js
 * var lookup = require('lookup-path');
 * var file = lookup('package.json');
 * ```
 *
 * @param  {String} `filepath`
 * @param  {Object} `options`
 * @return {String}
 */

module.exports = function lookup(filepath, cwd) {
  if (typeof filepath !== 'string') {
    return filepath; // implementors should do their own validation
  }
  cwd = cwd || process.cwd();
  if (isAbsolute(filepath)) {
    return filepath;
  } else if (fs.existsSync(path.join(cwd, filepath))) {
    return path.join(cwd, filepath);
  } else if (fs.existsSync(path.resolve(cwd, filepath))) {
    return path.resolve(cwd, filepath);
  } else {
    debug('cannot find: %s', filepath);
    return null;
  }
};
