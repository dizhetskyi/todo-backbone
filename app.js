'use strict';

var keys = {
  ENTER: 13,
  ESC: 27
};

window.TodoItem = Backbone.Model.extend({
  defaults: function(){
    return {
      title: 'new todo',
      done: false
    }
  },
  toggle: function(){
    this.save({'done': !this.get('done')});
  }
})

window.TodoList = Backbone.Collection.extend({
  model: TodoItem,
  localStorage: new Backbone.LocalStorage("todos"),
  initialize: function(){
    this.on('add', this.save);
    this.on('add', this.render);
    this.on('change', this.render);
  },
  done: function(){
    return this.where({done: true});
  },
  left: function(){
    return this.where({done: false});
  }
})

window.TodoItemView = Backbone.View.extend({
  tagName: 'li',
  template: _.template($('#todo-item-template').html()),
  initialize: function(){
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'filterOne', this.toggleVisibility);
  },
  events: {
    'change input.toggle': 'toggle',
    'click button.destroy': 'delete',
    'dblclick label': 'startEdit',
    'blur input.edit': 'cancelEdit',
    'keydown input.edit': 'submitEdit',
  },
  render: function(){
    this.$el.html(this.template(this.model.attributes));

    this.$editInput = this.$('input.edit');

    this.$el.toggleClass('completed', this.model.get('done'))

    this.toggleVisibility();

    return this;
  },

  toggle: function(){
    this.model.toggle();
  },  
  delete: function(){
    this.model.destroy();
  },
  startEdit: function(){

    this.$el.addClass('editing');

    this.$editInput.focus();
    this.$editInput.val(this.$editInput.val());
  },
  cancelEdit: function(){
    if (!this.$el.hasClass('editing')) return;

    this.$el.removeClass('editing');

    this.$editInput.val(this.model.get('title')); 
  },
  submitEdit: function(e){    
    if (e.keyCode == keys.ENTER){
      var trimmedVal = this.$editInput.val().trim();
      
      if (!trimmedVal) return;

      this.model.save({title: trimmedVal});

      this.cancelEdit();
    }
  },
  toggleVisibility: function(){   
    this.$el.toggleClass('hidden', !this.isVisible());
  },
  isVisible: function(){

    if (window.filterParam == 'active')
      return !this.model.get('done');

    if (window.filterParam == 'completed')
      return this.model.get('done');

    return true;
  }

})

window.TodoApp = Backbone.View.extend({
  el: '#todo-app',
  footerTemplate: _.template($('#footer-template').html()),
  events: {
    'keypress input.new-todo': 'newTodoHandler',
    'change input.toggle-all': 'toggleAll',
    'click button.clear-completed': 'clearCompleted',
  },
  initialize: function(){

    this.todos = new TodoList();

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
      .filter('[href="#/'+(window.filterParam || '') + '"]')
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

    this.$toggleAllInput.prop('checked', !left);

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

    this.$filterLinks = this.$('.filters a');
    
  },

  newTodoHandler: function(e){
    if (e.keyCode == keys.ENTER){
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

    this.todos.each(function(todoItem){
      todoItem.save({done: checked});
    })
  },
  clearCompleted: function(){
    _.invoke(this.todos.done(), 'destroy');
  }

})

var app = new TodoApp();

window.Router = Backbone.Router.extend({
  routes: {
    '*filter': 'applyFilter'
  },
  applyFilter: function(param){
    var param = param || '';

    window.filterParam = param;   
    app.trigger('filterAll');
  }
})

new Router();
Backbone.history.start();