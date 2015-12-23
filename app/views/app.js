define(['jquery', 'underscore', 'backbone', 'common', 'collections/todos', 'models/todo', 'views/todoItem', 'text!templates/todosFooter.html'], 
function($, _, Backbone, Common, TodosCollection, TodoItem, TodoItemView, TodosFooterTemplate){
	
	'use strict';

	var AppView = Backbone.View.extend({
	  el: '#todo-app',
	  footerTemplate: _.template(TodosFooterTemplate),
	  events: {
	    'keypress input.new-todo': 'newTodoHandler',
	    'change input.toggle-all': 'toggleAll',
	    'click button.clear-completed': 'clearCompleted',
	  },
	  initialize: function(){

	    this.todos = new TodosCollection();

	    this.$list = this.$('.todo-list');

	    this.$newTodoInput = this.$('input.new-todo');

	    this.$toggleAllInput = this.$('input.toggle-all');

	    this.$clearCompletedBtn = this.$('button.clear-completed');

	    this.$main = this.$('.main');
	    this.$footer = this.$('.footer');

	    this.listenTo(this.todos, 'add', this.addOne);
	    this.listenTo(this.todos, 'reset', this.fill);
	    this.listenTo(this.todos, 'all', this.render);

	    this.on('filterAll', this.applyFilter);

	    this.todos.fetch({reset: true});

	    this.$('.filters a').removeClass('selected');

	  },
	  applyFilter: function(){
	    this.todos.each(function(item){
	      item.trigger('filterOne');
	    })
	    this.$filterLinks.removeClass('selected')
	      .filter('[href="#/'+(Common.filterParam || '') + '"]')
	      .addClass('selected');
	  },
	  addOne: function(model){    
	    var view = new TodoItemView({model: model});
	    this.$list.append(view.render().$el);
	  },
	  fill: function(collection){
	    collection.each(this.addOne, this);
	  },
	  
	  render: function(){

	    var done = this.todos.done().length;
	    var left = this.todos.left().length;

	    if (this.todos.length){
	      this.$main.show();
	      this.$footer.show();

	      this.$footer.html(this.footerTemplate({
	        done: done,
	        left: left
	      }))

	    } else {
	      this.$main.hide();
	      this.$footer.hide();      
	    }

	    this.$toggleAllInput.prop('checked', !left);

	    this.$filterLinks = this.$('.filters a');
	    
	  },

	  newTodoHandler: function(e){
	    if (e.keyCode == Common.keys.ENTER){
	      var trimmedVal = this.$newTodoInput.val().trim();
	      if (!trimmedVal) return;

	      var model = new TodoItem({
	        title: this.$newTodoInput.val()
	      })
	      this.todos.add(model);
	      model.save();

	      this.$newTodoInput.val('');
	    }
	  },
	  toggleAll: function(){
	    var checked = this.$toggleAllInput.prop('checked');
	    _.invoke(this.todos.models, 'save', {done: checked})
	  },
	  clearCompleted: function(){
	    _.invoke(this.todos.done(), 'destroy');
	  }

	})

	return new AppView();

});