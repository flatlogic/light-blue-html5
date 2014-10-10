/*!
 * lookup-path <https://github.com/jonschlinkert/lookup-path>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var lookup = require('..');


describe('lookup', function () {
  it('should lookup path', function () {
    var actual = lookup('package.json');
    should.equal(typeof actual, 'string');
  });

  it('should lookup path from the cwd', function () {
    var actual = lookup('package.json', process.cwd());
    should.equal(typeof actual, 'string');
  });

  it('should lookup path from the cwd', function () {
    var actual = lookup('test.js', 'test');
    should.equal(typeof actual, 'string');
  });

  it('should return `null` when a path is not found.', function () {
    var actual = lookup('tesksksks.js');
    should.equal(actual, null);
  });
});