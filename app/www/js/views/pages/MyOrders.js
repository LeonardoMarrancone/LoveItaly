define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");
    var OrdersCollection = require("collections/OrdersCollection");

    var MyOrders = Utils.Page.extend({

        constructorName: "MyOrders",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.orders;

            if (localStorage.getItem('logged') == "true") {
                this.user_id = localStorage.getItem('user_id');
                this.orders = new OrdersCollection();
            }

        },

        id: "orders",

        render: function() {

            let page = this;

            if (localStorage.getItem('logged') == "true") { 
                this.orders.fetch({
                    success: function(orders) {

                        if (orders) {
                            let orders_html = page.template(orders);
                            orders_html = Handlebars.compile(orders_html)();
                            $('#content').html(orders_html);

                            $('.main-content').scrollTop(0, 0);
                        }
                        else{
                            let orders_html = page.template();
                            orders_html = Handlebars.compile(orders_html)();
                            $('#content').html(orders_html);
                            $('.empty-orders').css('display', 'block');

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

    });

    return MyOrders;

});