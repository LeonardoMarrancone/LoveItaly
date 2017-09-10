define(function(require) {

  var Backbone = require("backbone");

  var ProductsModel = Backbone.Model.extend({

      constructorName: "ProductsModel",

  });
  
  return ProductsModel;

});