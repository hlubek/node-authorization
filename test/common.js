var sys = require('sys');
global.p = sys.p;
global.puts = sys.puts;

global.assert = require('assert');
global.checkCallbacks = function(callbacks) {
  for (var k in callbacks) {
    assert.ok(callbacks[k], 'Callback '+k+' fired');
  }
};

global.authorization = require('../lib/authorization');
