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

        },

        id: "order",

        render: function() {

            let page = this;
                
            // let orderModel = new OrderModel({
            //     id: 0
            // });

            // orderModel.fetch({
            //     success: function(model, response, options) {
            //         let order = model.toJSON();
            //         let order_html = page.template(order);
            //         order_html = Handlebars.compile(order_html)();
            //         $('#content').html(order_html);

            //         $('.main-content').scrollTop(0, 0);

                    
            //     },
            //     error: function(XMLHttpRequest, textStatus, errorThrown) {
            //         console.log('Errore chiamata ajax!' +
            //             '\nReponseText: ' + XMLHttpRequest.responseText +
            //             '\nStatus: ' + textStatus +
            //             '\nError: ' + errorThrown);
            //     }
            // });

        },

    });

    return MyOrder;

});