define(function(require) {

    var Backbone = require("backbone");
    var ProductsModel = require("models/ProductsModel");
    var ProductModel = require("models/ProductModel");

    var WishlistCollection = Backbone.Collection.extend({
        constructorName: "WishlistCollection",
        model: ProductsModel,
        fetch: function(options){
            let wishlist = JSON.parse(localStorage.getItem('wishlist'));
            if (!wishlist) {
                wishlist = [];
            }
            options.success(wishlist)
            //options.error({}, {}, {})
        },
        addProduct: function(id_product, options) {
            let wishlist = JSON.parse(localStorage.getItem('wishlist'));
            if (!wishlist) {
                wishlist = [];
            }

            let product_model = new ProductModel({
                id: id_product
            })

            let product_found = false;

            for(let i = 0, length1 = wishlist.length; i < length1; i++){
                let product = wishlist[i];
                if (product.id == id_product) {
                    product_found = true;
                    break;
                }
            }

            if (!product_found) {
                product_model.fetch({
                    success: function(model){

                        let product = model.toJSON();

                        wishlist.unshift(product);
                        localStorage.setItem('wishlist', JSON.stringify(wishlist));

                        options.success(wishlist);
                    },
                    error: options.error
                })
            }
                
        },
        removeProduct: function(id_product, options) {
            let wishlist = JSON.parse(localStorage.getItem('wishlist'));
            if (wishlist) {
                for(let i = 0, length1 = wishlist.length; i < length1; i++){
                    let product = wishlist[i];
                    if ( product.id == id_product ) {
                        wishlist.splice(i, 1);
                        localStorage.setItem('wishlist', JSON.stringify(wishlist));
                        options.success(wishlist);
                        break;
                    }
                }
            }            
        }
    });

    return WishlistCollection;
});