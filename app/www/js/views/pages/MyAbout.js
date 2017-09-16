define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");

    var MyAbout = Utils.Page.extend({

        constructorName: "MyAbout",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.about;

        },

        id: "about",

        render: function() {

            let about_html = this.template();
            about_html = Handlebars.compile(about_html)();
            $('#content').html(about_html);

            $('.main-content').scrollTop(0, 0);

        },

    });

    return MyAbout;

});