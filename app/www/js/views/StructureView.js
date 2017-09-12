define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");

  var StructureView = Backbone.View.extend({

    constructorName: "StructureView",

    id: "main",

    initialize: function(options) {
      // load the precompiled template
      this.template = Utils.templates.structure;
      this.on("inTheDOM", () => {
        if (localStorage.getItem('logged') == "true") {
          $('#main-menu .logout, #main-menu .profile, #main-menu .orders').css('display', 'block');
          $('#main-menu .login, #main-menu .registration').css('display', 'none');
        }
        else {
          $('#main-menu .login, #main-menu .registration').css('display', 'block');
          $('#main-menu .logout, #main-menu .profile, #main-menu .orders').css('display', 'none');
        }
        $('#main-menu .item a').on('tap, click', function(e){
          e.preventDefault();
          return false;
        })
      });
    },

    events: {
      'tap #back': 'goBack',
      'back #back': 'goBack',
      'tap #toggle-menu': 'openMenu',
      'swipeLeft .overlay-menu, #main-menu': 'closeMenu',
      'swipeRight .main-content': 'openMenu',
      'tap .overlay-menu': 'closeMenu',
      'tap #main-menu > .list > .item a': 'closeMenuAndGoTo',
      'tap .logout': 'logout',
    },

    openMenu: function(e){
      e.preventDefault();

      $('.main-content, .menu-content').addClass('menu-opened');
      $('#main-menu').toggleClass('opened');
      $('.overlay-menu').toggleClass('active');
      
      return false;
    },

    closeMenu: function(e){
      e.preventDefault();

      $('#main-menu').toggleClass('opened');
      setTimeout(function(){
        $('.overlay-menu').toggleClass('active');
      },400);
      $('.main-content, .menu-content').removeClass('menu-opened');
      
      return false;
    },

    closeMenuAndGoTo: function(e){
      e.preventDefault();

      this.closeMenu(e);

      if ($(e.currentTarget).attr('data-url')) {
        let url = $(e.currentTarget).attr('data-url').substr(1);
        Backbone.history.navigate(url, { trigger: true });
      }
        
      return false;
    },

    logout: function(e){
      localStorage.removeItem('user_id');
      localStorage.setItem('logged', false);
      $('#main-menu .login, #main-menu .registration').css('display', 'block');
      $('#main-menu .logout, #main-menu .profile, #main-menu .orders').css('display', 'none');
    },

    render: function() {
      // load the template
      this.el.innerHTML = this.template({});
      // cache a reference to the content element
      this.contentElement = this.$el.find('#content')[0];

      return this;
    },


    // generic go-back function
    goBack: function() {
      window.history.back();
    },

  });

  return StructureView;

});