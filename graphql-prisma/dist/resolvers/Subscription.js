"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _getUserId = _interopRequireDefault(require("../utils/getUserId"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Subscription = {
  count: {
    subscribe: function subscribe(parent, args, _ref, info) {
      var pubsub = _ref.pubsub;
      var count = 0;
      setInterval(function () {
        count++;
        pubsub.publish('count', {
          count: count
        });
      }, 1000);
      return pubsub.asyncIterator('count');
    }
  },
  comment: {
    subscribe: function subscribe(parent, _ref2, _ref3, info) {
      var postId = _ref2.postId;
      var prisma = _ref3.prisma;
      return prisma.subscription.comment({
        where: {
          node: {
            post: {
              id: postId
            }
          }
        }
      }, info);
    }
  },
  post: {
    subscribe: function subscribe(parent, args, _ref4, info) {
      var prisma = _ref4.prisma;
      return prisma.subscription.post({
        where: {
          node: {
            published: true
          }
        }
      }, info);
    }
  },
  myPost: {
    subscribe: function subscribe(parent, args, _ref5, info) {
      var prisma = _ref5.prisma,
          request = _ref5.request;
      var userId = (0, _getUserId["default"])(request);
      return prisma.subscription.post({
        where: {
          node: {
            author: {
              id: userId
            }
          }
        }
      }, info);
    }
  }
};
exports["default"] = Subscription;