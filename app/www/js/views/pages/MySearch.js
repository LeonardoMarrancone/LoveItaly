define(function(require) {

    var $ = require("jquery");
    var Backbone = require("backbone");
    var _ = require("underscore");
    var Utils = require("utils");
    var Handlebars = require("handlebars");

    var WishlistCollection = require("collections/WishlistCollection");
    var CategoriesCollection = require("collections/CategoriesCollection");
    var SearchProductsCollection = require("collections/SearchProductsCollection");
    var CartModel = require("models/CartModel");

    var MySearch = Utils.Page.extend({

        constructorName: "MySearch",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.search;
            this.collection = new SearchProductsCollection({
                product_name: options.product_name,
                id_category: options.id_category
            });

            this.categoriesCollection = new CategoriesCollection();

        },

        id: "MySearch",

        render: function() {
            var page = this;

            this.collection.fetch({
                success: function(products_collection, response, options) {
                    let products = products_collection.toJSON();

                    page.categoriesCollection.fetch({
                        success: function(categories_collection, response, options) {
                            let categories = categories_collection.toJSON();

                            let search_html = page.template( {
                                products: products,
                                categories: categories,
                            } );

                            if (products && products.length > 0) {

                                search_html = Handlebars.compile(search_html)();

                                $('#content').html(search_html);
                                $('.main-content').scrollTop(0, 0);
                                $('.button-buy').on('tap', page.addCart);
                                $('.search-result-number-container').css('display', 'block');
                                $('.search-result-number').html(products.length);
                                $('.button-wishlist').on('tap', page.addWishlist);
                            }
                            else {
                                search_html = Handlebars.compile(search_html)();
                                $('#content').html(search_html);
                                $('.main-content').scrollTop(0, 0);
                                $('.search-result-number-container').css('display', 'none');
                                $('.empty-search').css('display', 'block');
                            }

                            if (page.collection.id_category) {
                                $('.catergory-container .categories').val(page.collection.id_category);
                            }

                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            console.log('Errore chiamata ajax!' +
                                '\nReponseText: ' + XMLHttpRequest.responseText +
                                '\nStatus: ' + textStatus +
                                '\nError: ' + errorThrown);
                        }
                    })
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Errore chiamata ajax!' +
                        '\nReponseText: ' + XMLHttpRequest.responseText +
                        '\nStatus: ' + textStatus +
                        '\nError: ' + errorThrown);
                }
            });

        },

        addWishlist: function(e){
            e.preventDefault();

            let id_product = $(this).attr("data-product-id");

            let wishlistCollection = new WishlistCollection();

            wishlistCollection.addProduct(id_product, {
                success: function(wishlist) {
                    navigator.notification.alert(
                        '',  // message
                        null,         // callback
                        'Aggiunto alla wishlist con successo',            // title
                        'OK'                  // buttonName
                    );
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Errore chiamata ajax!' +
                        '\nReponseText: ' + XMLHttpRequest.responseText +
                        '\nStatus: ' + textStatus +
                        '\nError: ' + errorThrown);
                }
            })
        },

        addCart: function(e){
            e.preventDefault();

            let product = {
                id: $(this).attr('data-product-id')
            };

            let quantity = 1;   

            if (localStorage.getItem('logged') == "true") {

                let cart = new CartModel({
                    user_id: localStorage.getItem('user_id')
                });

                cart.fetch({
                    success: function(model, response, options) {

                        if (model.toJSON().id) {
                            cart.updateCart(product, quantity, model, false,
                                function(result, textStatus, jqXHR) {
                                    navigator.notification.alert(
                                        '',  // message
                                        null,         // callback
                                        'Aggiunto al carrello con successo',            // title
                                        'OK'                  // buttonName
                                    );
                                }, function(jqXHR, textStatus, errorThrown) {
                                    navigator.notification.alert(
                                        'Impossibile aggiungere al carrello.',  // message
                                        null,         // callback
                                        'Errore',            // title
                                        'OK'                  // buttonName
                                    );
                                    console.log('Errore chiamata ajax!' +
                                        '\nReponseText: ' + jqXHR.responseText +
                                        '\nStatus: ' + textStatus +
                                        '\nError: ' + errorThrown);
                                })
                        }
                        else {
                            cart.create(function(model){
                                cart.updateCart(product, quantity, model, false,
                                    function(result, textStatus, jqXHR) {
                                        navigator.notification.alert(
                                            '',  // message
                                            null,         // callback
                                            'Aggiunto al carrello con successo',            // title
                                            'OK'                  // buttonName
                                        );
                                    }, function(jqXHR, textStatus, errorThrown) {
                                        navigator.notification.alert(
                                            'Impossibile aggiungere al carrello.',  // message
                                            null,         // callback
                                            'Errore',            // title
                                            'OK'                  // buttonName
                                        );
                                        console.log('Errore chiamata ajax!' +
                                            '\nReponseText: ' + jqXHR.responseText +
                                            '\nStatus: ' + textStatus +
                                            '\nError: ' + errorThrown);
                                    })
                            }, 
                            function(XMLHttpRequest, textStatus, errorThrown) {

                                console.log('Errore chiamata ajax!' +
                                    '\nReponseText: ' + XMLHttpRequest.responseText +
                                    '\nStatus: ' + JSON.stringify(textStatus) +
                                    '\nError: ' + JSON.stringify(errorThrown));
                            })
                        }
                        
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {

                        console.log('Errore chiamata ajax!' +
                            '\nReponseText: ' + XMLHttpRequest.responseText +
                            '\nStatus: ' + JSON.stringify(textStatus) +
                            '\nError: ' + JSON.stringify(errorThrown));
                    }
                })

            }
            
        },

    });

    return MySearch;

});