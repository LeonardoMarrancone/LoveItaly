define(function(require) {

    var Backbone = require("backbone");
    var CategoryModel = require("models/CategoryModel");

    var CategoriesCollection = Backbone.Collection.extend({

        constructorName: "CategoriesCollection",
        url: 'http://loveitaly.altervista.org/api/categories/?display=full&filter[active]=[1]&filter[link_rewrite]=![home|root]&io_format=JSON&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
        model: CategoryModel,

        parse: function(data) {
            return data.categories;
        },
        
    });

    return CategoriesCollection;

});