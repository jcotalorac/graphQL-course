"use strict";

var _graphqlYoga = require("graphql-yoga");

var _db = _interopRequireDefault(require("./db"));

var _resolver = require("./resolvers/resolver");

var _prisma = _interopRequireDefault(require("./prisma"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var pubsub = new _graphqlYoga.PubSub();
var server = new _graphqlYoga.GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: _resolver.resolvers,
  context: function context(request) {
    return {
      db: _db["default"],
      pubsub: pubsub,
      prisma: _prisma["default"],
      request: request
    };
  },
  fragmentReplacements: _resolver.fragmentReplacements
});
server.start({
  port: process.env.PORT || 4000
}, function (_ref) {
  var port = _ref.port;
  console.log('The server is up on port ' + port + '!');
});