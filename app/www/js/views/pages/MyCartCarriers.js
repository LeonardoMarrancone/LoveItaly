define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");

    var CarrierCollection = require("collections/CarriersCollection");
    var CartModel = require("models/CartModel");
    var UserModel = require("models/UserModel");

    var MyCartCarriers = Utils.Page.extend({

        constructorName: "MyCartCarriers",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.cart_carriers;
            if (localStorage.getItem('logged') == "true") {
                this.model = new CartModel({
                    user_id: localStorage.getItem('user_id')
                });
            }
            _.bindAll(this, 'updateCartAddressesAndCarriers');
        },

        id: "cart_carriers",

        render: function() {

            let page = this;
                
            let carrierCollection = new CarrierCollection();

            if (localStorage.getItem('logged') == "true") {

                carrierCollection.fetch({
                    success: function(collection, response, options) {
                        let carriers = collection.toJSON();
                        let carriers_html = page.template(carriers);
                        carriers_html = Handlebars.compile(carriers_html)();
                        $('#content').html(carriers_html);

                        $('.main-content').scrollTop(0, 0);

                        $('.carrier').on('change', function(e){
                            $('.choose-payments').css('display', 'block');
                        })

                        $('.choose-payments').on('tap', page.updateCartAddressesAndCarriers)

                        
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log('Errore chiamata ajax!' +
                            '\nReponseText: ' + XMLHttpRequest.responseText +
                            '\nStatus: ' + textStatus +
                            '\nError: ' + errorThrown);
                    }
                });
            }
            else {
                navigator.notification.alert(
                    'Per usare il carrello devi aver effettuato login.',  // message
                    function(){
                        Backbone.history.navigate('login', {trigger: true})
                    },         // callback
                    'Errore',            // title
                    'OK'                  // buttonName
                );
                
            }

        },

        updateCartAddressesAndCarriers: function(e){
            e.preventDefault();

            // fetch del carrello
            this.model.fetch({
                success: function(cart_model, response, options) {

                    let cart = cart_model.toJSON();

                    let user = new UserModel({
                        email: localStorage.getItem('email')
                    })

                    // fetch dell'utente
                    user.fetch({
                        success: function(u_model){

                            let user = u_model.toJSON();

                            if (!user.address_delivery.id || !user.address_invoice.id) {

                                navigator.notification.alert(
                                    'Per continuare l\'acquisto devi aver inserito l\'indirizzo di Consegna e di Fatturazione',
                                    function(){
                                        Backbone.history.navigate('profile', {trigger: true});
                                    },         // callback
                                    'Errore',            // title
                                    'OK'
                                )
                                return
                            }
                            
                            // aggiorna indirizzo di consegna e di fatturazione del carrello
                            cart_model.setAddresses(cart_model, user.address_delivery, user.address_invoice, 

                                function(){

                                    let id_carrier = parseInt($('input[name=carrier]:checked').val())
                                    let carrier = {
                                        id: id_carrier
                                    }

                                    // aggiorna la spedizione del carrello
                                    cart_model.setCarrier(cart_model, carrier, 
                                        function(){
                                            // vai al pagamento
                                            Backbone.history.navigate('cart-payments', {trigger: true});

                                        }, function(jqXHR, textStatus, errorThrown) {
                                            console.log('Errore chiamata ajax!' +
                                                '\nReponseText: ' + jqXHR.responseText +
                                                '\nStatus: ' + textStatus +
                                                '\nError: ' + errorThrown);
                                        })

                                }, 
                                function(jqXHR, textStatus, errorThrown) {
                                    console.log('Errore chiamata ajax!' +
                                        '\nReponseText: ' + jqXHR.responseText +
                                        '\nStatus: ' + textStatus +
                                        '\nError: ' + errorThrown);
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
                error: function(XMLHttpRequest, textStatus, errorThrown) {

                    console.log('Errore chiamata ajax!' +
                        '\nReponseText: ' + XMLHttpRequest.responseText +
                        '\nStatus: ' + textStatus +
                        '\nError: ' + errorThrown);
                }
            })  

            return false;
        }

    });

    return MyCartCarriers;

});