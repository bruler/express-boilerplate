'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = process.env.NODE_ENV || 'development';
var config = require('./' + env);

var defaults = {
  root: _path2.default.join(__dirname, '/..')
};

var _default = (0, _assign2.default)(defaults, config);

exports.default = _default;
module.exports = exports['default'];
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(env, 'env', '/home/cortana/Projects/JSProjects/express-boilerplate/config/environments/index.js');

  __REACT_HOT_LOADER__.register(defaults, 'defaults', '/home/cortana/Projects/JSProjects/express-boilerplate/config/environments/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', '/home/cortana/Projects/JSProjects/express-boilerplate/config/environments/index.js');
}();

;
//# sourceMappingURL=index.js.map
