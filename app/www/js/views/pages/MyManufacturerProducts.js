define(function(require) {

    var $ = require("jquery");
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");

    var ProductsModel = require("models/ProductsModel");
    var ManufacturerProductsCollection = require("collections/ManufacturerProductsCollection");
    var WishlistCollection = require("collections/WishlistCollection");
    var CartModel = require("models/CartModel");

    var MyManufacturerProducts = Utils.Page.extend({

        constructorName: "MyManufacturerProductsCollection",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.manufacturer_products;
            this.id_manufacturer = options.id
        },

        id: "MyManufacturerProductsCollection",
        className: "",
        model: ProductsModel,
        collection: ManufacturerProductsCollection,

        render: function() {
            var MyCollection = new ManufacturerProductsCollection({
                id: this.id_manufacturer
            });

            var page = this;
            MyCollection.fetch({
                success: function(collection, response, options) {
                    let products = collection.toJSON();

                    let products_html = page.template(products);
                    products_html = Handlebars.compile(products_html)();
                    $('#content').html(products_html);
                    $('.manufacturer-name').html(products[0].manufacturer_name)
                    $('.main-content').scrollTop(0, 0);
                    $('.button-buy').on('tap', page.addCart);
                    $('.button-wishlist').on('tap', page.addWishlist);
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
            else {
                let cart = new CartModel();
                cart.addProductLocalStorage(product, quantity, {
                    success: function(){
                        navigator.notification.alert(
                            '',  // message
                            null,         // callback
                            'Aggiunto al carrello con successo',            // title
                            'OK'                  // buttonName
                        );
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
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
                    }
                });
            }
            
        },
    });

    return MyManufacturerProducts;

});