define(['underscore', 'backbone'], function(_, Backbone){
	'use strict';
	return Backbone.View.extend({
		template: 'sticker-template',
		tacked: false,
		readonly: false,
		moreLikeThisTimes: 0,
        initialize: function(){
			//console.log("who is the model?", this.model);
        	this.listenTo(this.model, 'change', this.render);
			this.model.fetch();
        },
		render: function(){
			var template = _.template( $("#" + this.template).html() );
			var newEl =  template(this.model.toJSON());
			this.$el.css("display", "none");
			this.$el.attr("data-item-id", this.model.get('uri'));
			this.$el.append ( $(newEl) );
			this.$el.addClass('sticker'); 
			// col
			var col = "col-lg-4 col-md-4 col-sm-6 col-xs-12";
			this.$el.addClass(col);
			// set tacked value in a bizarre way...
			this.tacked = !! this.model.get('tacked');
			this.readonly = !! this.model.get('readonly');
			if(this.tacked){
				this.$el.addClass('tacked');
				this.$el.find(".actions .tack").hide().attr('title', 'Untack it!').removeClass('fa-tack').addClass('fa-circle').show();
				this.$el.find(".actions .remove-this").fadeOut();
				this.$el.find(".actions .more-like-this").fadeIn();
			}else{
				this.$el.find(".actions .more-like-this").fadeOut();
			}
			if(this.readonly){
				this.$el.addClass('readonly');
				this.$el.find(".actions").remove();
			}
			this.$el.fadeIn(1000);
		},
		tack: function(){
			var self = this;
//			console.log("triggered tack, changing", this.tacked);
			
			if(!!this.tacked){
				var utcb = function(){
					self.$el.fadeOut(500).promise().done(function(){ $(self).toggleClass('tacked'); });
					self.tacked = !this.tacked;
					self.$el.find(".actions .tack").hide().attr('title', 'Tack it!').removeClass('fa-circle').addClass('fa-tack').show();
					self.$el.find(".actions .remove-this").fadeIn();
					self.$el.find(".actions .more-like-this").fadeOut();
					self.$el.prependTo($('#discovery')).fadeIn();
				};
				Tackboard.untack(this.model, utcb);
				//this.$el.promise().done();
				
			}else{
				if(Tackboard.tack(this.model)){
					// if this is ok trigger also 'more like this'
					self.moreLikeThis();
				}
				this.$el.promise().done(function(){
					self.$el.fadeOut(500).promise().done(function(){ $(self).toggleClass('tacked'); });
					self.tacked = !this.tacked;
					self.$el.find(".actions .tack").fadeOut(300, function(){ $(this).attr('title', 'Untack it!').removeClass('fa-tack').addClass('fa-circle').fadeIn(); });
					self.$el.find(".actions .remove-this").fadeOut();
					self.$el.find(".actions .more-like-this").fadeIn();
					self.$el.appendTo($('#tackboard')).fadeIn();
				});
			}
			
		},
		/*  TODO trigger discovery of any thing of this topic, and disable the topic?
		likeTopic: function(){
			console.log("triggered like topic");
			
		},*/
		moreLikeThis: function(){
			this.moreLikeThisTimes = this.moreLikeThisTimes+1;
			// Trigger on the controller
			Tackboard.moreLikeThis(this.model, this.moreLikeThisTimes);
			// animation
			this.$el.find(".actions .more-like-this").fadeOut().fadeIn();
		},
		lessLikeThis: function(){
			// notify the controller this is discarded
			Tackboard.discard(this.get('uri'));
			// disappear
			this.$el.fadeOut(1000, function(){ $(this).remove()});
			// TODO Anything smarter here?
		},
		removeThis: function(){
			if(this.tacked) return;
			//console.log("triggered less like this");
			// disappear
			this.$el.fadeOut(1000, function(){ $(this).remove()});
			// TODO Anything smarter here?
		},
		events: {
			"click .more-like-this" : "moreLikeThis",
			"click .remove-this" : "removeThis",
/*			"click .explanation .topic" : "likeTopic", */
			"click .tack" : "tack",
		},
	});
});