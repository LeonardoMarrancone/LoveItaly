define(function(require) {

  var Backbone = require("backbone");

  var ReviewModel = Backbone.Model.extend({

      constructorName: "ReviewModel",

  });
  
  return ReviewModel;

});