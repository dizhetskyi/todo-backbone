define([
		'jquery', 
		'underscore', 
		'backbone', 
		'common',
		'text!templates/todoItem.html'
	], 
	function(
		$, _, Backbone, 
		Common,
		TodoItemTemplate
		){
	
	'use strict';

	var TodoItem = Backbone.View.extend({
	  tagName: 'div',
	  className: 'todo-item-full',
	  template: _.template(TodoItemTemplate),
	  events: {
	  	'click .backdrop': 'backToList'
	  },
	  initialize: function(){

	  },
	  render: function(){

	  	var content = this.template(this.model.attributes);
	  	this.$el.html(content);

	  	$('body').append(this.$el);

	  	return this;
	  	
	  },
	  show: function(){
	  	this.$el.addClass('show');
	  },
	  backToList: function(){
	  	Backbone.history.navigate(Common.filterParam, {trigger: true});
	  }

	})

	return TodoItem;

});