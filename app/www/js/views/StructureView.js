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

        $(document).on("offline", this.setOfflineMode, false);

        $(document).on("online", this.setOnlineMode, false);

        if (localStorage.getItem('logged') == "true") {
          $('#main-menu .logout, #main-menu .profile, #main-menu .orders').css('display', 'block');
          $('#main-menu .login, #main-menu .registration').css('display', 'none');
          $('.container-choose-city').css('display', 'none');
        }
        else {
          $('#main-menu .login, #main-menu .registration').css('display', 'block');
          $('#main-menu .logout, #main-menu .profile, #main-menu .orders').css('display', 'none');
        }
        $('#main-menu .item a').on('tap, click', function(e){
          e.preventDefault();
          return false;
        });

        setInterval(function(){
          $('.slider-pager-page').each(function(index, slide_pager){
            if ( $(slide_pager).hasClass('active') ) {
                let next_index = (index + 1) % $('.slider-pager-page').length
                $(slide_pager).removeClass('active')
                $($('.slider-pager-page')[next_index]).addClass('active');
                $('.slider-slides').css('transform', 'translateX(-'+(100*(next_index))+'%)');
                return false;
            }
          }) 
        }, 3000);
        
      });
    },

    events: {
      'tap #back': 'goBack',
      'back #back': 'goBack',
      'tap #toggle-menu': 'openMenu',
      'swipeLeft .overlay-menu, #main-menu': 'closeMenu',
      //'swipeRight .main-content': 'openMenu',
      'tap .overlay-menu': 'closeMenu',
      'tap #main-menu > .list > .item a': 'closeMenuAndGoTo',
      'tap .logout': 'logout',
      'submit .search-form': 'search',
      'submit .select-city-form': 'selectCity',
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
      localStorage.removeItem('city_delivery');
      localStorage.setItem('logged', false);
      $('#main-menu .login, #main-menu .registration').css('display', 'block');
      $('#main-menu .logout, #main-menu .profile, #main-menu .orders').css('display', 'none');
      Backbone.history.navigate('', {trigger: true});
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

    setOnlineMode: function(e){
      $('body').addClass('online-mode');
      $('body').removeClass('offline-mode');
    },

    setOfflineMode: function(e){
      $('body').addClass('offline-mode');
      $('body').removeClass('online-mode');
    },

    search: function(e) {
      e.preventDefault();

      let product_name = $('.search-form .product-name').val().trim();

      let id_category = ($('.catergory-container .categories').length > 0) ? $('.catergory-container .categories').val().trim() : '';
  
      if (id_category) {
        Backbone.history.navigate('search/'+product_name+"/"+id_category, {trigger: true});
      }
      else {
        Backbone.history.navigate('search/'+product_name, {trigger: true});  
      }
      

      return false;
    },

    selectCity: function(e) {
      e.preventDefault();

      let city = $('.select-city-form .city-delivery').val();

      if (city) {
        localStorage.setItem('city_delivery', city);
        Backbone.history.navigate('', {trigger: true});
        $('body').removeClass('choose-city-opened');
        $('.container-choose-city').css("display", "none");
      }
      else {
        navigator.notification.alert(
          'Per continuare bisogna selezionare una città.',  // message
          function(){},         // callback
          'Errore',            // title
          'OK'                  // buttonName
        );
      }

      return false;
    },

  });

  return StructureView;

});