define(['jquery', 'underscore', 'backbone', 'common', 'views/app', 'views/todoItem'], 
	function($, _, Backbone, Common, AppView, TodoItemView){

	'use strict';

	var AppRouter =  Backbone.Router.extend({
	  routes: {
	    'todo-:id': 'showTodoItem',
	    '*filter': 'applyFilter'
	  },
	  initialize: function(){
	  },
	  applyFilter: function(param){
	    var param = param || '';

	    Common.filterParam = param;   
	    AppView.trigger('filterAll');

	    if (Common.todoItemFullView){
	    	Common.todoItemFullView.remove();
	    }

	  },
	  showTodoItem: function(id){
	  	var model = AppView.todos.find(function(item){return item.cid == id});
	  	var view = new TodoItemView({model: model});
	  	view.render();
	  	view.show();

	  	Common.todoItemFullView = view;
	  }
	})

	return new AppRouter();
	
})