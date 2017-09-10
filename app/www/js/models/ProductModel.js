define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require("backbone");

  var ProductModel = Backbone.Model.extend({

      constructorName: "ProductModel",

      features: [],
      reviews: [],
      card_details: '',

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

          let model = this;

          let product = data.product;

          if  (product.associations.product_features) {

            let product_features = product.associations.product_features;

            for(let i = 0, length1 = product_features.length; i < length1; i++){

              let product_feature = product_features[i];

              $.ajax({
                url: 'http://loveitaly.altervista.org/api/product_features/'+product_feature.id+'?io_format=JSON&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
                async: false,
                type: "GET",
                dataType: 'json',
                success: function(data) {

                  let feature_name = data.product_feature.name;

                  $.ajax({
                    url: 'http://loveitaly.altervista.org/api/product_feature_values/'+product_feature.id_feature_value+'?io_format=JSON&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
                    async: false,
                    type: "GET",
                    dataType: 'json',
                    success: function(data) {
                      
                      let index = _.findIndex(model.features, function(feature){
                        return feature.name == feature_name;
                      })
                      if(index >= 0) {
                        model.features[i].value.push(data.product_feature_value.value);
                      }
                      else{
                        model.features.push({name: feature_name, value: [data.product_feature_value.value]});
                      }

                      model.set('features', model.features);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                      console.log('Errore chiamata ajax!' +
                        '\nReponseText: ' + XMLHttpRequest.responseText +
                        '\nStatus: ' + textStatus +
                        '\nError: ' + errorThrown);
                    }
                  })
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                  console.log('Errore chiamata ajax!' +
                    '\nReponseText: ' + XMLHttpRequest.responseText +
                    '\nStatus: ' + textStatus +
                    '\nError: ' + errorThrown);
                }
              })


            }
          }

          return product;
      },

      sync: function(method, collection, options) {
          options = options || {};
          return Backbone.Model.prototype.sync.apply(this, arguments);
      }
  });

  return ProductModel;
});
