define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");

    var MyContacts = Utils.Page.extend({

        constructorName: "MyContacts",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.contacts;

        },

        id: "contacts",

        render: function() {

            let contacts_html = this.template();
            contacts_html = Handlebars.compile(contacts_html)();
            $('#content').html(contacts_html);

            $('.main-content').scrollTop(0, 0);

        },

    });

    return MyContacts;

});