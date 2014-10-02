define(['underscore', 'backbone', 'views/sticker'], function(_, Backbone, StickerView){
	return Backbone.View.extend({
		// renderQueue: [],
		//template: 'sticker-template',
		initialize: function() {
		    // in the view, listen for events on the model / collection
		    this.collection.bind("reset", this.render, this);
			var o = this;
			// setInterval(function(){o.feedView();}, 1000);
		},
		// feedView: function(){
// 			if(this.renderQueue.length > 0){
// 				console.log("feeding discovery view", this.renderQueue);
// 				var i = this.renderQueue.shift();
// 				console.log("item", i.$el);
// 				this.$el.prepend(i.$el);
// 			}
// 		},
		render: function(){
			var self = this;
			var interval = 1000;
			var waittime = 0;
			// Render new discovery results
			_.each(this.collection.models, function(item){
				//var tmpl = $('#' + self.template).html();
				//var template = _.template(tmpl);
				var sticker = new StickerView({ model: item });
				//item.fetch();
				//self.renderQueue.push(sticker);
				//setTimeout(function(){item.fetch();}, waittime);
				//waittime += interval;
				self.$el.append(sticker.$el);
				self.$el.show();
			});
		}
		,
		append: function(){
			
		},
		keyup: function(o){
			
		},
		events: {
			keyup : 'keyup',
			
		},
	});
});