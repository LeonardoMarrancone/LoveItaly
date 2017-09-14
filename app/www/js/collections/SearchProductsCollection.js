define(function(require) {

    var ProductsModel = require("models/ProductsModel");

    var SearchProductsCollection = Backbone.Collection.extend({
        constructorName: "SearchProductsCollection",

        initialize: function(options) {
            this.product_name = options.product_name.trim();
            this.id_category = options.id_category;
        },

        url: function() {
            var url = "http://192.168.56.101/loveitaly/api/search?language=1&query=";
            url += this.product_name;
            url += "&io_format=JSON&display=full&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H";
            return url;
        },

        model: ProductsModel,

        parse: function(data) {

            let products = [];

            if (!(Array.isArray(data))) {

                if (this.id_category) {

                    for(let i = 0, length1 = data.products.length; i < length1; i++){

                        let product = data.products[i];

                        if (product.associations && product.associations.categories) {
                            
                            let categories = product.associations.categories;

                            for(let j = 0, length2 = categories.length; j < length2; j++){
                                let category = categories[j];

                                if (category.id == this.id_category) {
                                    products.push(product);
                                    break;
                                }
                            }

                        }
                    }

                }
                else {
                    products = data.products;
                }

            }

            return products;

        },

    });


    return SearchProductsCollection;
});