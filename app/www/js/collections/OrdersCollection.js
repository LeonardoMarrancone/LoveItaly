define(function(require) {

    var Backbone = require("backbone");
    var OrderModel = require("models/OrderModel");

    var OrderCollection = Backbone.Collection.extend({
        constructorName: "OrderCollection",
        model: OrderModel,
        fetch: function(options){
            options.success(localStorage.getItem('orders'))
            options.error({}, {}, {})
        }
    });

    return OrderCollection;
});