define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");

    var OrderModel = require("models/OrderModel");

    var MyOrder = Utils.Page.extend({

        constructorName: "MyOrder",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.order;

            if (localStorage.getItem('logged') == "true") {
                this.user_id = localStorage.getItem('user_id');
                this.model = new OrderModel({
                    id: options.id
                });
            }
        },

        id: "order",

        render: function() {

            let page = this;

            this.model.fetch({
                success: function(order) {
                    
                    let order_html = page.template(order);
                    order_html = Handlebars.compile(order_html)();
                    $('#content').html(order_html);

                    $('.main-content').scrollTop(0, 0);

                    
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Errore chiamata ajax!' +
                        '\nReponseText: ' + XMLHttpRequest.responseText +
                        '\nStatus: ' + textStatus +
                        '\nError: ' + errorThrown);
                }
            });

        },

    });

    return MyOrder;

});