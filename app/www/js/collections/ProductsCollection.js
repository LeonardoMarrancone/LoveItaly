define(function(require) {

    var Backbone = require("backbone");
    var ProductsModel = require("models/ProductsModel");

    var ProductsCollection = Backbone.Collection.extend({
        constructorName: "ProductsCollection",
        model: ProductsModel,
        url: 'http://192.168.56.101/loveitaly/api/products/?display=full&filter[price]=>[0]&io_format=JSON&limit=14&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',

        parse: function(data) {
            return data.products;
        },

        sync: function(method, collection, options) {
            options = options || {};
            return Backbone.Collection.prototype.sync.apply(this, arguments);
        }
    });

    return ProductsCollection;
});