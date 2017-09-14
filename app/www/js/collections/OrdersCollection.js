define(function(require) {

    var Backbone = require("backbone");
    var OrderModel = require("models/OrderModel");

    var OrderCollection = Backbone.Collection.extend({
        constructorName: "OrderCollection",
        model: OrderModel,
        fetch: function(options){
            let orders = JSON.parse(localStorage.getItem('orders'));
            if (!orders) {
                orders = [];
            }
            options.success(orders)
            //options.error({}, {}, {})
        },
        addOrder: function(order) {
            let orders = JSON.parse(localStorage.getItem('orders'));
            if (!orders) {
                orders = [];
            }
            orders.unshift(order);
            localStorage.setItem('orders', JSON.stringify(orders));
        }
    });

    return OrderCollection;
});