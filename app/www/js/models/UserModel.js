define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require("backbone");
  var md5 = require("md5");

  var UserModel = Backbone.Model.extend({

      constructorName: "UserModel",

      initialize: function(options) {
          this.email = options.email;
          this.passwd = md5('7j3EQiXxwscCNaOIORd8YqmvkjfEmDVxs4EcihNJNVNyCG4bHA3ThTnk' + options.passwd);
      },

      url: function() {
          let url = 'http://192.168.56.101/loveitaly/api/customers/?display=full&io_format=JSON&filter[email]=[' + this.email + ']&filter[passwd]=[' + this.passwd + ']&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H';
          return url;
      },

      parse: function(data) {

        if (!(Array.isArray(data))) {
          let user = data.customers[0];
          return user;
        }
        
        return null;

      },

      sync: function(method, collection, options) {
          options = options || {};
          return Backbone.Model.prototype.sync.apply(this, arguments);
      }
  });

  return UserModel;
});
