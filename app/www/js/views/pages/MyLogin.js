define(function(require) {

    var $ = require('jquery');
    var Backbone = require("backbone");
    var Utils = require("utils");
    var Handlebars = require("handlebars");
    var UserModel = require("models/UserModel");
    var CartModel = require("models/CartModel");

    var MyLogin = Utils.Page.extend({

        constructorName: "MyLogin",

        initialize: function(options) {
            // load the precompiled template
            this.template = Utils.templates.login;

        },

        id: "login",

        render: function() {

            let login_html = this.template();
            login_html = Handlebars.compile(login_html)();
            $('#content').html(login_html);
            $('.main-content').scrollTop(0, 0);
            $('#login-form').on('submit', this.login)

            $('.email').val(localStorage.getItem('email'))

            return this;

        },

        login: function(e){
            e.preventDefault();

            let email = $(".email").val().trim();
            let passwd = $(".password").val().trim();

            if(!email || !passwd) {
                navigator.notification.alert(
                    'Tutti i campi sono obbligatori. Rincontrollare i campi.',  // message
                    null,         // callback
                    'Impossibile effettuare il login',            // title
                    'OK'                  // buttonName
                );
                return false;
            }

            let user = new UserModel({
                email: email,
                passwd: passwd
            });

            user.fetch({
                success: function(model, response, options) {

                    let user = model.toJSON();

                    if(user.id) {
                        localStorage.setItem('email', email)
                        localStorage.setItem('user_id', user.id)
                        localStorage.setItem('logged', true)

                        $('#main-menu .logout, #main-menu .profile, #main-menu .orders').css('display', 'block');
                        $('#main-menu .login, #main-menu .registration').css('display', 'none');

                        let cart_model = new CartModel({
                            user_id: user.id
                        });

                        cart_model.syncLocalStorageToServer({
                            success: function(){
                                
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                console.log('Errore chiamata ajax!' +
                                    '\nReponseText: ' + XMLHttpRequest.responseText +
                                    '\nStatus: ' + textStatus +
                                    '\nError: ' + errorThrown);
                            }
                        });

                        navigator.notification.alert(
                            'Verrai mandato automaticamente nella home.',  // message
                            function(){
                                Backbone.history.navigate("home", {
                                    trigger: true
                                });
                            },         // callback
                            'Login avvenuto con successo',            // title
                            'OK'                  // buttonName
                        );
                    }
                    else {

                        localStorage.removeItem('user_id');
                        localStorage.setItem('logged', false);
                        $('#main-menu .login, #main-menu .registration').css('display', 'block');
                        $('#main-menu .logout, #main-menu .profile, #main-menu .orders').css('display', 'none');

                        navigator.notification.alert(
                            'Utente non esistente o campi errati.',  // message
                            null,         // callback
                            'Errore durante il login',            // title
                            'OK'                  // buttonName
                        );
                    }

                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {

                    localStorage.removeItem('user_id');
                    localStorage.setItem('logged', false);
                    $('#main-menu .login, #main-menu .registration').css('display', 'block');
                    $('#main-menu .logout, #main-menu .profile, #main-menu .orders').css('display', 'none');

                    navigator.notification.alert(
                        'Si è verificato un errore durante la fase di login.',  // message
                        null,         // callback
                        'Errore',            // title
                        'OK'                  // buttonName
                    );
                    console.log('Errore chiamata ajax!' +
                        '\nReponseText: ' + XMLHttpRequest.responseText +
                        '\nStatus: ' + textStatus +
                        '\nError: ' + errorThrown);
                }
            })
      
            return false;
        }
    });

    return MyLogin;

});