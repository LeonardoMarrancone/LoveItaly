define(function(require) {

    var Backbone = require("backbone");
    var _ = require("underscore");
    var RandomProductsModel = require("models/RandomProductsModel");

    var RandomProductsCollection = Backbone.Collection.extend({
        constructorName: "RandomProductsCollection",
        model: RandomProductsModel,

        id_categories: [],

        initialize: function(id_categories){
            this.id_categories = id_categories;
        },

        url: function(){
            var url = 'http://192.168.56.101/loveitaly/api/products/?display=full&filter[price]=>[0]&io_format=JSON&limit=21&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H';

            var random_categories = _.sample(this.id_categories, 3);

            url += '&filter[id_category_default]=[' +
                ( random_categories[0] ) +
                '|' + ( random_categories[1] ) +
                '|' + ( random_categories[2] ) +
            ']';

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

    return RandomProductsCollection;
});