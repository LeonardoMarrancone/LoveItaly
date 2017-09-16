define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");
    var CartModel = require("models/CartModel");

    var MyCart = Utils.Page.extend({

        constructorName: "MyCart",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.cart;

            if (localStorage.getItem('logged') == "true") {
                this.user_id = localStorage.getItem('user_id');
                this.model = new CartModel({
                    user_id: this.user_id
                });
            }
            else {
                this.model = new CartModel();
            }
        },

        id: "cart",

        render: function() {

            let page = this;

            if (localStorage.getItem('logged') == "true") {

                this.model.fetch({
                    success: function(model, response, options) {

                        let cart = model.toJSON();
                        
                        if (cart.products && cart.products.length > 0) {

                            let cart_html = page.template(cart);
                            cart_html = Handlebars.compile(cart_html)();
                            $('#content').html(cart_html);
                            
                            $('.total-price').html(cart.total_price);

                            $('.empty-cart').css('display', 'none');
                            $('.footer-cart').css('display', 'block');

                            $('.quantity').on('change', function(){

                                let product_id = $(this).attr('data-product-id');
                                let quantity = parseInt($(this).val());

                                page.model.updateCart({
                                        id: product_id
                                    }, quantity, model, true, function(){
                                        page.render();
                                    }, function(jqXHR, textStatus, errorThrown) {
                                        console.log('Errore chiamata ajax!' +
                                            '\nReponseText: ' + jqXHR.responseText +
                                            '\nStatus: ' + textStatus +
                                            '\nError: ' + errorThrown);
                                    })
                            })

                            $('.button-delete-from-cart').on('tap', function(){
                                
                                let product_id = $(this).attr('data-product-id');
                                let quantity = 0;

                                navigator.notification.confirm(
                                    '',  // message
                                    function(buttonIndex){

                                        if (buttonIndex > 1) return;

                                        page.model.updateCart({
                                                id: product_id
                                            }, quantity, model, true, function(data){
                                                page.render();
                                            }, function(jqXHR, textStatus, errorThrown) {
                                                console.log('Errore chiamata ajax!' +
                                                    '\nReponseText: ' + jqXHR.responseText +
                                                    '\nStatus: ' + textStatus +
                                                    '\nError: ' + errorThrown);
                                            })
                                    },         // callback
                                    'Sicuro di voler cancellare questo prodotto?',            // title
                                    ['Si','Annulla']                  // buttonName
                                );

                                        
                            })
                        }
                        else {
                            let cart_html = page.template(cart);
                            cart_html = Handlebars.compile(cart_html)();
                            $('#content').html(cart_html);
                            $('.footer-cart').css('display', 'none');
                            $('.empty-cart').css('display', 'block');
                        }

                            
                        $('.main-content').scrollTop(0, 0);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {

                        console.log('Errore chiamata ajax!' +
                            '\nReponseText: ' + XMLHttpRequest.responseText +
                            '\nStatus: ' + textStatus +
                            '\nError: ' + errorThrown);
                    }
                })
                        
            }
            else {

                let cart = this.model.fetchLocalStorage()

                if (cart.products && cart.products.length > 0) {

                    let cart_html = page.template(cart);
                    cart_html = Handlebars.compile(cart_html)();
                    $('#content').html(cart_html);
                    
                    $('.total-price').html(cart.total_price);

                    $('.empty-cart').css('display', 'none');
                    $('.footer-cart').css('display', 'block');

                    $('.quantity').on('change', function(){

                        let product_id = $(this).attr('data-product-id');
                        let quantity = parseInt($(this).val());

                        page.model.updateProductLocalStorage({
                            id: product_id
                        }, quantity)
                        
                        page.render();
                    })

                    $('.button-delete-from-cart').on('tap', function(){
                        
                        let product_id = $(this).attr('data-product-id');

                        navigator.notification.confirm(
                            '',  // message
                            function(buttonIndex){

                                if (buttonIndex > 1) return;

                                page.model.removeProductLocalStorage({
                                    id: product_id
                                })
                                
                                page.render();
                            },         // callback
                            'Sicuro di voler cancellare questo prodotto?',            // title
                            ['Si','Annulla']                  // buttonName
                        );

                                
                    })
                }
                else {
                    let cart_html = page.template(cart);
                    cart_html = Handlebars.compile(cart_html)();
                    $('#content').html(cart_html);
                    $('.footer-cart').css('display', 'none');
                    $('.empty-cart').css('display', 'block');
                }

                    
                $('.main-content').scrollTop(0, 0);
                
            }
                

        },

    });

    return MyCart;

});