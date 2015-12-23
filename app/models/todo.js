define(['jquery', 'underscore', 'backbone'], function($, _, Backbone){

  'use strict';
  
  var TodoItem = Backbone.Model.extend({
    defaults: function(){
      return {
        title: 'new todo',
        done: false,
        description: '<p>Full description here</p><p>And another paragraph</p>'
      }
    },
    toggle: function(){
      this.save({'done': !this.get('done')});
    }
  })

  return TodoItem;

})