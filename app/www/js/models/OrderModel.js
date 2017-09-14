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
        let orders = JSON.parse(localStorage.getItem('orders'));

        let order = _.find(orders, (item) => {
          return item.id == this.id;
        })

        if (order) {
          options.success(order);
        } 
        else {
          options.error({}, {}, {});
        }
      },
      
  });

  return OrderModel;
});
