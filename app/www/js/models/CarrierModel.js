define(function(require) {

  var Backbone = require("backbone");

  var CarrierModel = Backbone.Model.extend({

      constructorName: "CarrierModel",

      initialize: function(options) {
          this.id = options.id;
      },

      url: function() {
          var url = 'http://192.168.56.101/loveitaly/api/carriers/';
          url += this.id;
          url += '?io_format=JSON&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H';
          return url;
      },

      parse: function(data) {
        let carrier = data.carrier;
        return carrier;

      }

  });
  
  return CarrierModel;

});