define(function(require) {

  var Backbone = require("backbone");

  var RandomProductsModel = Backbone.Model.extend({

      constructorName: "RandomProductsModel",

  });
  
  return RandomProductsModel;

});