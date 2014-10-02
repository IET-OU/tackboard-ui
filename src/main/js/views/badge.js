define(['backbone'], function(Backbone){
	
	return Backbone.View.extend({
		template: 'badge-template',
        initialize: function(){
        	this.model.on('change', this.render, this);
        },
		render: function(){
			var template = _.template( $("#" + this.template).html(), this.model.attributes);
		    this.$el.html( template );
		},
		home: function(){
			Tackboard.navigate('', {trigger: true});
		},
		events: {
			"click a" : "home"
		},
		
	});
});