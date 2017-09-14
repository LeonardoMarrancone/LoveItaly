define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");
    var xml2json = require("xml2json");
    xml2json = new xml2json();

    var ProductModel = require("models/ProductModel");
    var CartModel = require("models/CartModel");

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
            
        }

    });

    return MyProduct;

});