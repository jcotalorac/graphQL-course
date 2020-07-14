"use strict";

require("@babel/polyfill");

var _server = _interopRequireDefault(require("./server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_server["default"].start({
  port: process.env.PORT || 4000
}, function (_ref) {
  var port = _ref.port;
  console.log('The server is up on port ' + port + '!');
});