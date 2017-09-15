define(function(require) {

    var $ = require("jquery");
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");

    var ProductsModel = require("models/ProductsModel");
    var ProductsCollection = require("collections/ProductsCollection");
    var RandomProductsCollection = require("collections/RandomProductsCollection");
    var WishlistCollection = require("collections/WishlistCollection");
    var CartModel = require("models/CartModel");

    var MyHome = Utils.Page.extend({

        constructorName: "MyHome",

        initialize: function(options) {
            // load the precompiled template
            this.home_template = Utils.templates.home;
            this.products_home_template = Utils.templates.products_home;

        },

        id: "Myhome",
        className: "",
        model: ProductsModel,
        collection: ProductsCollection,

        render: function() {
            var MyHomeCollection = new ProductsCollection();

            $('#content').html($(this.el).html(this.home_template()));

            var page = this;
            MyHomeCollection.fetch({
                success: function(collection, response, options) {
                    let prodotti = collection.toJSON();

                    let products_html = page.products_home_template( [prodotti.slice(0, 7), prodotti.slice(7)] );
                    products_html = Handlebars.compile(products_html)();
                    $('#new-products').html(products_html);
                    $('.main-content').scrollTop(0, 0);

                    $('#new-products .button-buy').on('tap', page.addCart);
                    $('#new-products .button-wishlist').on('tap', page.addWishlist);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Errore chiamata ajax!' +
                        '\nReponseText: ' + XMLHttpRequest.responseText +
                        '\nStatus: ' + textStatus +
                        '\nError: ' + errorThrown);
                }
            });

            $.ajax({
                url: 'http://192.168.56.101/loveitaly/api/categories/?display=[id]&io_format=JSON&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
                async: true,
                type: "GET",
                dataType: 'json',
                success: function(data) {
                    let id_categories = data.categories.map(function(item, index) {
                        return item.id;
                    })

                    var MyRandomHomeCollection = new RandomProductsCollection(id_categories);

                    MyRandomHomeCollection.fetch({
                        success: function(collection, response, options) {
                            let prodotti = collection.toJSON();

                            let products_html = page.products_home_template( [prodotti.slice(0, 7), prodotti.slice(7, 14), prodotti.slice(14)] );
                            products_html = Handlebars.compile(products_html)();
                            $('#showcase-products').html(products_html);

                            $('#showcase-products .button-buy').on('tap', page.addCart);
                            $('#showcase-products .button-wishlist').on('tap', page.addWishlist);

                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            console.log('Errore chiamata ajax!' +
                                '\nReponseText: ' + XMLHttpRequest.responseText +
                                '\nStatus: ' + textStatus +
                                '\nError: ' + errorThrown);
                        }
                    });
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Errore chiamata ajax!' +
                        '\nReponseText: ' + XMLHttpRequest.responseText +
                        '\nStatus: ' + textStatus +
                        '\nError: ' + errorThrown);
                }
            })

                    

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

    return MyHome;

});