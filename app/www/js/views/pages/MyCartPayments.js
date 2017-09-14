define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");
    var CartModel = require("models/CartModel");
    var OrdersCollection = require("collections/OrdersCollection");

    var MyCartPayments = Utils.Page.extend({

        constructorName: "MyCartPayments",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.cart_payments;

            if (localStorage.getItem('logged') == "true") {
                this.user_id = localStorage.getItem('user_id');
                this.model = new CartModel({
                    user_id: this.user_id
                });
                this.order = {}
            }

            _.bindAll(this, 'sendOrder')

        },

        id: "cart_payments",

        render: function() {

            let page = this;

            if (localStorage.getItem('logged') == "true") { 
                this.model.fetch({
                    success: function(model) {
                        let cart = model.toJSON();
                        page.order = cart;

                        let payments_html = page.template();
                        payments_html = Handlebars.compile(payments_html)();
                        $('#content').html(payments_html);

                        $('.total-price').html(cart.total_price);
                        
                        $('.main-content').scrollTop(0, 0);

                        $('.payment').on('change', function(e){
                            $('.send-order').css('display', 'block');
                        })

                        $('.send-order').on('tap', page.sendOrder)

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

        sendOrder: function(e){
            e.preventDefault();

            let payment = $('input[name=payment]:checked').val();

            if(!payment) {

                navigator.notification.alert(
                    'Per effettuare l\'ordine bisogna scegliere una modalità di pagamento.',  // message
                    function(){
                        Backbone.history.navigate('home', {trigger: true})
                    },         // callback
                    'Errore',            // title
                    'OK'                  // buttonName
                );

                return false;
            }

            let ordersCollection = new OrdersCollection();

            this.order.payment = payment;

            ordersCollection.addOrder(this.order);

            // crea un nuovo carrello vuoto
            this.model.create(function(){

            }, function(XMLHttpRequest, textStatus, errorThrown) {

                console.log('Errore chiamata ajax!' +
                    '\nReponseText: ' + XMLHttpRequest.responseText +
                    '\nStatus: ' + textStatus +
                    '\nError: ' + errorThrown);
            })

            navigator.notification.alert(
                '',  // message
                function(){
                    Backbone.history.navigate('home', {trigger: true})
                },         // callback
                'Ordine avvenuto con successo.',            // title
                'OK'                  // buttonName
            );

        }

    });

    return MyCartPayments;

});