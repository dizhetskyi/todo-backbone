requirejs.config({
  baseUrl: './app/',
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    },
    backboneLocalstorage: {
      deps: ['backbone'],
      exports: 'Store'
    }
  },
  paths: {
    jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery',
    underscore: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore',
    backbone: 'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.3/backbone',
    text: 'https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text',
    backboneLocalstorage: 'https://cdnjs.cloudflare.com/ajax/libs/backbone-localstorage.js/1.1.16/backbone.localStorage',
  }
});

requirejs(['jquery', 'underscore', 'backbone', 'views/app', 'routers/app'], function($, _, Backbone, AppView, AppRouter){
	Backbone.history.start();
});