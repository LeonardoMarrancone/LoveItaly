define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");

    var MyCartPayments = Utils.Page.extend({

        constructorName: "MyCartPayments",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.cart_payments;

        },

        id: "cart_payments",

        render: function() {

            let page = this;

            let payments_html = this.template();
            payments_html = Handlebars.compile(payments_html)();
            $('#content').html(payments_html);

            $('.main-content').scrollTop(0, 0);

        },

    });

    return MyCartPayments;

});