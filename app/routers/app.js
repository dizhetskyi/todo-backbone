define(['jquery', 'underscore', 'backbone', 'common', 'views/app'], function($, _, Backbone, Common, AppView){

	'use strict';

	var AppRouter =  Backbone.Router.extend({
	  routes: {
	    '*filter': 'applyFilter'
	  },
	  applyFilter: function(param){
	    var param = param || '';

	    Common.filterParam = param;   
	    AppView.trigger('filterAll');
	  }
	})

	return new AppRouter();
	
})