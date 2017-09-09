define(function(require) {

  var Backbone = require("backbone");

  var ProductModel = Backbone.Model.extend({

      constructorName: "ProductModel",

      initialize: function(options) {
          this.id = options.id;
      },

      url: function() {
          var url = 'http://loveitaly.altervista.org/api/products/';
          url += this.id;
          url += '?io_format=JSON&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H';
          return url;
      },

      parse: function(data) {
          return data.product;
      },

      sync: function(method, collection, options) {
          options = options || {};
          // options.beforeSend = autenticazione;
          return Backbone.Model.prototype.sync.apply(this, arguments);
      }
  });

  return ProductModel;
});
