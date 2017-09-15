define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");
    var wishlistCollection = require("collections/wishlistCollection");
    var CartModel = require("models/CartModel");

    var MyWishlist = Utils.Page.extend({

        constructorName: "MyWishlist",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.wishlist;

            this.collection = new wishlistCollection();
        },

        id: "wishlist",

        render: function() {

            let page = this;

            this.collection.fetch({
                success: function(wishlist) {

                    if (wishlist && wishlist.length > 0) {

                        let wishlist_html = page.template(wishlist);
                        wishlist_html = Handlebars.compile(wishlist_html)();
                        $('#content').html(wishlist_html);

                        $('.main-content').scrollTop(0, 0);

                        $('.button-buy').on('tap', page.addCart);

                        $('.button-remove-wishlist').on('tap', function(e){
                            e.preventDefault();

                            let id_product = $(this).attr('data-product-id');

                            page.collection.removeProduct(id_product, {
                                success: function(wishlist) {
                                    page.render();
                                }
                            })

                            return false;
                        })
                    }
                    else{
                        let wishlist_html = page.template();
                        wishlist_html = Handlebars.compile(wishlist_html)();
                        $('#content').html(wishlist_html);
                        $('.empty-wishlist').css('display', 'block');

                        $('.main-content').scrollTop(0, 0);
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

    return MyWishlist;

});