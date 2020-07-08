"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.greeting = exports.name = exports.message = void 0;
var message = 'This is a message from myModule';
exports.message = message;
var name = 'Example name';
exports.name = name;
var location = 'Location value';
exports["default"] = location;

var greeting = function greeting(name) {
  return "Greeting ".concat(name);
};

exports.greeting = greeting;