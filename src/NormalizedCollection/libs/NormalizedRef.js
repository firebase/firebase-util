'use strict';

var util      = require('../../common');
var Query     = require('./Query');

function NormalizedRef(record, parent) {
  this._super(this, record);
  var paths = record.getPathManager().getPaths();
  this._parent = parent||null;
  this._name = _name(paths);
  this._toString = _toString(paths);
}

util.inherits(NormalizedRef, Query, {
  'child': function(fieldName) {
    var record = this._rec.child(fieldName);
    return new NormalizedRef(record, this);
  },

  'parent': function() {
    return this._parent;
  },

  'root': function() {
    var p = this;
    while(p.parent() !== null) {
      p = p.parent();
    }
    return p;
  },

  'name': function() {
    return this._name;
  },

  'toString': function() {
    return this._toString;
  },

  'set': function() {}, //todo

  'update': function() {}, //todo

  'remove': function() {}, //todo

  'push': function() {}, //todo

  'setWithPriority': function() {}, //todo

  'setPriority': function() {}, //todo

  /****************************
   * UNSUPPORTED FUNCTIONS
   ***************************/
  'auth': notSupported('auth'),
  'unauth': notSupported('unauth'),

  //todo upgrade this to include 1.1.x API methods

  'transaction': notSupported('transaction'),
  'goOffline': notSupported('goOffline'),
  'goOnline': notSupported('goOnline'),
  'onDisconnect': notSupported('onDisconnect')

});

function notSupported(method) {
  return function() {
    throw new Error(method + ' is not supported for NormalizedCollection references');
  };
}

function _name(paths) {
  if( paths.length > 1 ) {
    return '[' + util.map(paths, function(p) {
      return p.name();
    }).join('][') + ']';
  }
  else {
    return paths[0].name();
  }
}

function _toString(paths) {
  return paths.length > 1? '[' + util.map(paths, function(p) {
    return p.url();
  }).join('][') + ']' : paths[0].url();
}

module.exports = NormalizedRef;