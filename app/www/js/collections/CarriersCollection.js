define(function(require) {

    var Backbone = require("backbone");
    var CarrierModel = require("models/CarrierModel");

    var CarriersCollection = Backbone.Collection.extend({
        constructorName: "CarriersCollection",

        url: 'http://192.168.56.101/loveitaly/api/carriers/?display=full&filter[deleted]=[0]&io_format=JSON&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',

        parse: function(data) {
            return data.carriers;
        },

        sync: function(method, collection, options) {
            options = options || {};
            return Backbone.Collection.prototype.sync.apply(this, arguments);
        }
    });

    return CarriersCollection;
});