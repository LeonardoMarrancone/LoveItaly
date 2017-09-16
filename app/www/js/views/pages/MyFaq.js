define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");

    var MyFaq = Utils.Page.extend({

        constructorName: "MyFaq",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.faq;

        },

        id: "faq",

        render: function() {

            let faq_html = this.template();
            faq_html = Handlebars.compile(faq_html)();
            $('#content').html(faq_html);

            $('.main-content').scrollTop(0, 0);

        },

    });

    return MyFaq;

});