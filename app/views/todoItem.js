define(['jquery', 'underscore', 'backbone', 'common', 'text!templates/todoItem.html'], function($, _, Backbone, Common, TodoItemTemplate){

  'use strict';

  var TodoItemView = Backbone.View.extend({
    tagName: 'li',
    template: _.template(TodoItemTemplate),
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
      if (e.keyCode == Common.keys.ENTER){
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

      if (Common.filterParam == 'active')
        return !this.model.get('done');

      if (Common.filterParam == 'completed')
        return this.model.get('done');

      return true;
    }

  })

return TodoItemView;

})