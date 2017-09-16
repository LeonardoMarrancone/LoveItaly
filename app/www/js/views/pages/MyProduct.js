define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");
    var xml2json = require("xml2json");
    xml2json = new xml2json();

    var WishlistCollection = require("collections/WishlistCollection");
    var ReviewsCollection = require("collections/ReviewsCollection");
    var ProductModel = require("models/ProductModel");
    var CartModel = require("models/CartModel");
    var UserModel = require("models/UserModel");
    var OrdersCollection = require("collections/OrdersCollection");

    var MyProduct = Utils.Page.extend({

        constructorName: "MyProduct",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.product;
            this.product_id = options.id;
            this.model = new ProductModel({
                id: this.product_id
            });

            this.model.on('change', () => {
                this.renderFeatures();
            })

            _.bindAll(this, 'addCart');
            _.bindAll(this, 'sendReview');
        },

        id: "product",

        switchContentTab: function(e){
            $('.single-product .tabs .tab-item').removeClass('active');
            $(e.currentTarget).addClass('active');
            let tabContentId = $(e.currentTarget).attr('data-tab');
            $('.container-content-tabs .tab-content.active').removeClass('active');
            $(tabContentId).addClass('active');
        },

        render: function() {

            let page = this;
            
            this.model.fetch({
                success: function(model, response, options) {
                    let product = model.toJSON();
                    let product_html = page.template(product);
                    product_html = Handlebars.compile(product_html)();
                    $('#content').html(product_html);

                    $('.single-product .tabs .tab-item').on('tap', function(e) {
                        page.switchContentTab(e);
                    })
                    
                    $('.main-content').scrollTop(0, 0);

                    $('.add-cart').on('tap', page.addCart) 
                    $('.button-wishlist').on('tap', page.addWishlist);

                    if (localStorage.getItem('logged') == "true") {
                        let ordersCollection = new OrdersCollection();
                        ordersCollection.fetch({
                            success: function(orders) {
                                for(let i = 0, length1 = orders.length; i < length1; i++){
                                    let order = orders[i];

                                    for(let j = 0, length2 = order.products.length; j < length2; j++){
                                        if (!order.products[i]) {
                                            continue;
                                        }
                                        if ( order.products[i].id == product.id ) {
                                            $('#reviews-tab .send-review').css("display", "block");
                                            $('#reviews-tab .send-review').on('submit', page.sendReview);
                                            $('.cant-review').css("display", "none");
                                            return;
                                        }
                                    }
                                        
                                }  
                                $('.cant-review').css("display", "block");
                                
                            }
                        })    

                    }
                    $('.cant-review').css("display", "block");

                    return page;
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Errore chiamata ajax!' +
                        '\nReponseText: ' + XMLHttpRequest.responseText +
                        '\nStatus: ' + textStatus +
                        '\nError: ' + errorThrown);
                }
            });

        },

        renderFeatures: function() {
            let product = this.model.toJSON();
            let product_html = this.template(product);
            product_html = Handlebars.compile(product_html)();
            $('#features-tab').html($(product_html).find('#features-tab').html());
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

        sendReview: function(e){
            e.preventDefault();

            let page = this;

            let comment = $('#reviews-tab .comment').val().trim();

            if (!comment) {
                navigator.notification.alert(
                    'Il campo Commento è vuoto',  // message
                    null,         // callback
                    'Errore',            // title
                    'OK'                  // buttonName
                );
                return;
            }

            let user_model = new UserModel({
                email: localStorage.getItem('email')
            })
            user_model.fetch({
                success: function(model){
                    let user = model.toJSON();
                    
                    let product = page.model.toJSON();
                    let reviewsCollection = new ReviewsCollection();
                    let date = new Date();

                    reviewsCollection.addReview(product.id, {
                        username: user.firstname + " " + user.lastname,
                        rating: $('#reviews-tab .rating').val(),
                        date: date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear(),
                        comment: comment,
                    }, {
                        success: function(review) {
                            navigator.notification.alert(
                                '',  // message
                                null,         // callback
                                'Recensione inviata con successo.',            // title
                                'OK'                  // buttonName
                            );
                        }
                    })
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('Errore chiamata ajax!' +
                        '\nReponseText: ' + jqXHR.responseText +
                        '\nStatus: ' + textStatus +
                        '\nError: ' + errorThrown);
                }
            })

        },

        addCart: function(e){
            e.preventDefault();

            let product = this.model.toJSON();

            let quantity = parseInt($('.quantity').val());

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
            
        }

    });

    return MyProduct;

});