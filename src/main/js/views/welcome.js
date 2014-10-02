define(['backbone'], function(Backbone){
	
	return Backbone.View.extend({
		template: 'welcome-template',
		
        initialize: function(){
        	this.model.on('change', this.render, this);
        },
		render: function(){
			var template = _.template( $("#" + this.template).html(), this.model.attributes);
		    this.$el.html( template );
			this.$el.show();
		},
		start: function(){
			Tackboard.createNewBoard();
		},
		events:{
			"click a.start-to-tack" : "start"
		}
	});
});