define(function(require) {

    var Backbone = require("backbone");
    var ProductsModel = require("models/ProductsModel");

    var ManufacturerProductsCollection = Backbone.Collection.extend({
        constructorName: "ManufacturerProductsCollection",
        model: ProductsModel,

        initialize: function(options){
            this.id_manifacturer = options.id
        },

        url: function(){
            var url = 'http://192.168.56.101/loveitaly/api/products/?display=full&filter[price]=>[0]&filter[id_manufacturer]=['+this.id_manifacturer+']&io_format=JSON&limit=21&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H';
            return url;
        },

        parse: function(data) {
            return data.products;
        },

        sync: function(method, collection, options) {
            options = options || {};
            return Backbone.Collection.prototype.sync.apply(this, arguments);
        }
    });

    return ManufacturerProductsCollection;
});