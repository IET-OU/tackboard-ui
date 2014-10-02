define(['backbone', 'models/user'], function(Backbone, User){
	
	return Backbone.View.extend({
		template: 'board-template',
		
		initialize: function() {
	        this.model.on('change', this.renderIfNotTyping, this);
		},
		typed: false,
		renderIfNotTyping: function(){
			if(!this.typed){
				this.render();
			}
		},
		render: function(){
			var template = _.template( $("#" + this.template).html(), this.model.attributes);
		    this.$el.html( template );
			var self = this;
		    //this.$el.find('[contenteditable=true]').on('input', changedata).on('onselectionchange', changedata);
		    self.model.on('change', function(){
				if(!!self.typed) {
					self.$el.find('.save').fadeIn();
				}
		    });
		    // if read only, hide delete button
		    if(!self.model.get('readonly')){
		    	this.$el.find('a i.delete').show();
		    }
			this.$el.show();
		},
		keydownHandler: function(e) {
			// only to control return
			if ( e.which === 13 ) {
				if(event.preventDefault) {
					e.preventDefault();
				} else {
					// this for IE
					e.returnValue = false;
				}
			}
		},
		keyupHandler: function(e) {
			if ( e.which === 13 ) {
				if(event.preventDefault) {
					e.preventDefault();
				} else {
					// this for IE
					e.returnValue = false;
				}
				// trigger save?
				this.saveHandler();
				$(e.target).blur();
				return false;
			}else{
				this.editingTitleHandler(e);
			}
			return true;
		},
		saveHandler: function(){
			this.typed = false;
			this.model.save({label: this.model.get('label')}, {
				patch: true,
				success: function(){ },
				error: function(){ }
			}).done(function(){
				// This must trigger list reload
				User.fetch();
			});
			this.$el.find('.save').fadeOut();
		},
		editingTitleHandler: function(e){
			self = this;
			self.typed = true;
	    	var field = $(e.target).attr('data-field-name');
	    	// this to avoid spaces around...
	        var value = $.trim(e.target.innerText);
	        self.model.set(field, $.trim(value));
		},
		ensafeHandler: function(){
			this.$el.find('.delete').fadeOut(500, function(){this.deleteReady = false; $(this).removeClass('alarm').fadeIn();});
		},
		deleteReady: false,
		deleteHandler: function(){
			var self = this;
			// Place
			if(this.deleteReady === true){
				this.deleteReady = false; // for security reasons...
				Tackboard.messageProgress('Deleting board...');
				this.model.destroy().done(function(){
					self.ensafeHandler();
					// This must trigger home
					User.fetch().done(function(){
						Tackboard.navigate('#', {trigger: true});
						//Tackboard.messageInfo('Board deleted');
					});
				});
			}else{
				this.deleteReady = true;
				var self = this;
				setTimeout(function(){self.ensafeHandler();}, 3000);
				this.$el.find('.delete').addClass('alarm');
			};
		},
		events: {
			'keyup label' : 'keyupHandler', // we use keyup to register changes
			'keydown label' : 'keydownHandler', // we use keydown to prevent return to add newline
			'click .save' : 'saveHandler',
			'click .delete' : 'deleteHandler'
		}
	});
});