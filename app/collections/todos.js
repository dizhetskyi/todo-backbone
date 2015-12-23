define(['jquery', 'underscore', 'backbone', 'backboneLocalstorage', 'models/todo'], function($, _, Backbone, Storage, TodoModel){

  'use strict';
  
  var TodoList = Backbone.Collection.extend({
    model: TodoModel,
    localStorage: new Storage("todos"),
    initialize: function(){
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

  return TodoList;

})