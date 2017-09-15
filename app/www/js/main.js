// here we put the paths to all the libraries and framework we will use
require.config({
  paths: {
    jquery: '../lib/zepto/zepto', // ../lib/jquery/jquery', 
    underscore: '../lib/underscore/underscore',
    backbone: "../lib/backbone/backbone",
    text: '../lib/require/text',
    async: '../lib/require/async',
    handlebars: '../lib/handlebars/handlebars',
    templates: '../templates',
    leaflet: '../lib/leaflet/leaflet',
    spin: '../lib/spin/spin.min',
    preloader: '../lib/preloader/pre-loader',
    utils: '../lib/utils/utils',
    md5: '../lib/md5.min',
    xml2json: '../lib/xml2json.min',
  },
  shim: {
    'jquery': {
      exports: '$'
    },
    'underscore': {
      exports: '_'
    },
    'handlebars': {
      exports: 'Handlebars'
    },
    'leaflet': {
      exports: 'L'
    }
  }
});

require(['handlebars'], function(Handlebars) {
  Handlebars.registerHelper('formatCurrency', function(value) {
    return parseFloat(value).toFixed(2);
  });

  Handlebars.registerHelper('convertToStars', function(value) {
    value = parseInt(value);
    let stars = '';

    for(let i = 0; i < value; i++){
      stars += '<i class="icon ion-ios-star"></i>';
    }
    for(let i = 0; i < 5-value; i++){
      stars += '<i class="icon ion-ios-star-outline"></i>';
    }

    return stars;
  });
})

// We launch the App
require(['backbone', 'utils'], function(Backbone, Utils) {
  require(['preloader', 'router', 'jquery'], function(PreLoader, AppRouter, $) {

    document.addEventListener("deviceready", run, false);

    function run() {

      // Here we precompile ALL the templates so that the app will be quickier when switching views
      // see utils.js
      Utils.loadTemplates().once("templatesLoaded", function() {

      var images = []; // here the developer can add the paths to the images that he would like to be preloaded

      if (images.length) {
          new PreLoader(images, {
            onComplete: startRouter
          });
        } else {
          // start the router directly if there are no images to be preloaded
          startRouter();
        }

        function startRouter() {
          // launch the router
          var router = new AppRouter();

          router.on('route', function(route, params) {

            if (device.platform != "Android") {
              if(route == 'showStructure' || route == 'home') {
                $('#toggle-menu').addClass('active');
                $('#back.active').removeClass('active');
              }
              else {
                $('#toggle-menu.active').removeClass('active');
                $('#back').addClass('active');
              }
            }

          })
          
          Backbone.history.start();
        }
      });
    }
  });
});