define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require("backbone");

  var OrderModel = Backbone.Model.extend({

      constructorName: "OrderModel",

      initialize: function(options) {
        this.id = options.id;
      },

      fetch: function(options){
        let orders = localStorage.getItem('orders');
        let order = orders[this.id]
        options.success(order)
        options.error({}, {}, {})
      },
      
  });

  return OrderModel;
});
