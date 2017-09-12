define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require("backbone");

  var ManufacturerModel = Backbone.Model.extend({

      constructorName: "ManufacturerModel",

      address: {},

      initialize: function(options) {
          this.id = options.id;
      },

      url: function() {
          var url = 'http://192.168.56.101/loveitaly/api/manufacturers/';
          url += this.id;
          url += '?io_format=JSON&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H';
          return url;
      },

      parse: function(data) {
        let model = this;
        let manufacturer = data.manufacturer;
        $.ajax({
          url: 'http://192.168.56.101/loveitaly/api/addresses/'+manufacturer.id+'?io_format=JSON&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
          async: false,
          type: "GET",
          dataType: 'json',
          success: function(data) {
            model.set('address', data.address);
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('Errore chiamata ajax!' +
              '\nReponseText: ' + XMLHttpRequest.responseText +
              '\nStatus: ' + textStatus +
              '\nError: ' + errorThrown);
          }
        })
        return manufacturer;
      },

      sync: function(method, collection, options) {
          options = options || {};
          return Backbone.Model.prototype.sync.apply(this, arguments);
      }
  });

  return ManufacturerModel;
});
