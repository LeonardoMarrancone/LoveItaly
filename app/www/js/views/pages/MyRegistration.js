define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");

    var MyRegistration = Utils.Page.extend({

        constructorName: "MyRegistration",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.registration;

        },

        id: "registration",

        render: function() {

            let registration_html = this.template();
            registration_html = Handlebars.compile(registration_html)();
            $('#content').html(registration_html);
            $('.main-content').scrollTop(0, 0);
            $('#registration-form').on('submit', this.registration)
            return this;

        },

        registration: function(e){
            e.preventDefault();

            let email = $(".email").val().trim();
            let passwd = $(".password").val().trim();
            let repeat_passwd = $(".repeat-password").val().trim();
            let firstname = $(".firstname").val().trim();
            let lastname = $(".lastname").val().trim();

            if(!email || !passwd || !repeat_passwd || !firstname || !lastname || (passwd != repeat_passwd)) {
                navigator.notification.alert(
                    'Tutti i campi sono obbligatori. Rincontrollare i campi.',  // message
                    null,         // callback
                    'Impossibile registrarsi',            // title
                    'OK'                  // buttonName
                );
                return false;
            }

            $.ajax({
                url: 'http://192.168.56.101/loveitaly/api/customers/?schema=blank&ws_key=IYI6M35MLB8UVW38Y99RY3YPQWRX5X8H',
                async: true,
                type: 'GET',
                dataType: 'xml',
                success: function(data, textStatus, jqXHR) {
                    
                    let xml = $(jqXHR.responseText.replace('<?xml version="1.0" encoding="UTF-8"?>', ''));
                    xml.find('email').html(email);
                    xml.find('passwd').html(passwd);
                    xml.find('firstname').html(firstname);
                    xml.find('lastname').html(lastname);
                    xml.find('active').html(1);
                    var contact = '<?xml version="1.0" encoding="UTF-8"?><prestashop xmlns:xlink="http://www.w3.org/1999/xlink">' + xml.html() + '</prestashop>';
                    
                    $.ajax({
                        url: 'http://192.168.56.101/loveitaly/api/customers/',
                        async: true,
                        type: "POST",
                        dataType: 'xml',
                        contentType: "text/xml",
                        headers: {
                            "Authorization": 'Basic SVlJNk0zNU1MQjhVVlczOFk5OVJZM1lQUVdSWDVYOEg6'
                        },
                        data: contact,
                        success: function(result, textStatus, jqXHR) {
                            localStorage.setItem('email', email)
                            localStorage.setItem('logged', false)
                            navigator.notification.alert(
                                'Verrai mandato automaticamente nella sezione di login.',  // message
                                function(){
                                    Backbone.history.navigate("login", {
                                        trigger: true
                                    });
                                },         // callback
                                'Registrazione avvenuta con successo',            // title
                                'OK'                  // buttonName
                            );
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            navigator.notification.alert(
                                'Controllare se i campi sono corretti.',  // message
                                null,         // callback
                                'Errore durante la registrazione',            // title
                                'OK'                  // buttonName
                            );
                            console.log('Errore chiamata ajax!' +
                                '\nReponseText: ' + jqXHR.responseText +
                                '\nStatus: ' + textStatus +
                                '\nError: ' + errorThrown);
                        }
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('Errore chiamata ajax!' +
                        '\nReponseText: ' + jqXHR.responseText +
                        '\nStatus: ' + textStatus +
                        '\nError: ' + errorThrown);
                }
            })

                    
            return false;
        }
    });

    return MyRegistration;

});