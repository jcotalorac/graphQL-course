"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getUserId = function getUserId(request) {
  var requiredAuth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var headerAuth = request.request ? request.request.headers.authorization : request.connection.context.Authorization;

  if (headerAuth) {
    var token = headerAuth.replace('Bearer ', '');

    var decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);

    return decoded.userId;
  }

  if (requiredAuth) {
    throw new Error('Authentication required');
  }

  return null;
};

exports["default"] = getUserId;