// This is a singleton
define([ 	'settings', 	'backbone', 'models/user', 'models/board', 	'views/typetopic', 'views/welcome', 'views/board', 'views/badge', 	'views/user', 	'models/stanbol-entity', 	'models/text-entities', 'models/discovery-item', 'models/discovery-collection', 'models/tacked-collection', 'views/discovery' ], 
function(	Settings, 		Backbone, 	User, 			Board,			TypetopicView, 		WelcomeView,	BoardView,		BadgeView, 		UserView, 		StanbolEntity, 				TextEntities, 			DiscoveryItem, 			DiscoveryCollection, 			TackedCollection, 			DiscoveryView	){

	var Controller = Backbone.Router.extend({
		
		_foundItems: [],
		_likedItems: [],
		_likedItems: [],
		
		Views: {
			Welcome: false,
			User: false,
			Discovery: false,
			Board: false,
			Badge: false,
			Typetopic: false
		},
		routes: {
			// here configuration of URI patterns
			'' : '_home',
			':id/edit' : '_editBoard',
			':id' : '_viewBoard'
		},
		
		// Here we define actions
		_home: function(){
			$('#page-welcome,#page-board').hide().promise().done(function(){
				$('#page-welcome').fadeIn();
			});
			var C = this;
			// Clean interface to the initial state
			this.cleanUI(function(){
				if( ! C.Views.Welcome ) {
					C.Views.Welcome = new WelcomeView( { el: $("#welcome"), model: User } );
					C.Views.Welcome.render();
				} else {
					C.Views.Welcome.$el.show();
				}
				if( ! C.Views.User ) {
					C.Views.User = new UserView( { el: $("#user"), model: User } );
					C.Views.User.render();
				} else {
					C.Views.User.$el.show();
				}
			});
		},
		_viewBoard: function(id){
			
			// Board
			var C = this;
			$('#page-welcome,#page-board').hide().promise().done(function(){
				$('#page-board').fadeIn();
			});
			
			// Clean interface to the initial state
			this.cleanUI(function(){
			
				if(!C.Board) C.Board = new Board({readonly: true});
				C.Board.set('id', id);
				C.Board.set('readonly', true);
				
				if( ! C.Views.Badge ){
					C.Views.Badge = new BadgeView( { el: $("#badge"), model: User } );
					C.Views.Badge.render();
				} else{
					C.Views.Badge.$el.show();
				}
				if( ! C.Views.Board ){
					C.Views.Board = new BoardView( { el: $("#board"), model: C.Board } );
					C.Views.Board.render();
				} else{
					C.Views.Board.$el.show();
				}
			
				C.Board.fetch({
					success: function(model, response){
						// Compose Tackboard View Layout 
						
						//new TypetopicView( { el: $("#typetopic") } ).render();
						
						//new UserView( { el: $("#user"), model: User } ).render();
						if(model.get('tacked').length > 0){
							// Load Discovery view
							var tacked = new TackedCollection();
							$.map(model.get('tacked'), function(uri) {
								tacked.add(new DiscoveryItem({ uri: uri, tacked: true, readonly: true}));
							});
							if( !! C.Views.Discovery ) {
								C.Views.Discovery.$el.html('');
							}
							C.Views.Discovery = new DiscoveryView({el: $("#tackboard"), collection: tacked});
							C.Views.Discovery.render();
						}else{
							C.messageInfo("This board is empty");
						}
					},
				    error: function(model, response, error) {
						// Not found?
						if(response.status == '404'){
							C.messageWarn("Board not found");
						}else{
							C.messageError("An error occurred");
						}
				    }
				});
			});
		},
		_editBoard: function(id){
			// Board
			var C = this;
			// Clean interface to the initial state
			$('#page-welcome,#page-board').hide().promise().done(function(){
				$('#page-board').fadeIn();
			});
			this.cleanUI(function(){

				// Compose Tackboard Edit Layout 
				if( ! C.Views.Typetopic ) {
					C.Views.Typetopic = new TypetopicView( { el: $("#typetopic") } );
					C.Views.Typetopic.render();
				}else{
					C.Views.Typetopic.$el.show();							
				}
				if( ! C.Views.Badge ) {
					C.Views.Badge = new BadgeView( { el: $("#badge"), model: User } );
					C.Views.Badge.render();
				}else{
					C.Views.Badge.$el.show();
				}
				if( ! C.Views.User ) {
					C.Views.User = new UserView( { el: $("#user"), model: User } );
					C.Views.User.render();
				}else{
					C.Views.User.$el.show();							
				}
				
				if( ! C.Board) C.Board = new Board();
				C.Board.set('id', id);
				C.Board.set('readonly', false);
				if( ! C.Views.Board ){
					C.Views.Board = new BoardView( { el: $("#board"), model: C.Board } );
				} else {
					C.Views.Board.$el.show();
				}
				
				C.Board.fetch({
					success: function(model, response){
						// if board is not editable, switch to view mode
						if(model.get('readonly') == true){
							Tackboard.navigate(id, {trigger: true});
						}
						if(model.get('tacked').length > 0){
							// Load Discovery view
							var tacked = new TackedCollection();
							$.map(model.get('tacked'), function(uri) {
								tacked.add(new DiscoveryItem({uri: uri, tacked: true}));
							});
							// The DiscoveryView Must Be Reset in any case
							
							// Found items initialized!

							// new DiscoveryView({collection: tacked}).render();
							if( !! C.Views.Discovery ) {
								C.Views.Discovery.$el.html('');
							}
							C.Views.Discovery = new DiscoveryView({el: $("#tackboard"), collection: tacked});
							C.Views.Discovery.render();
						}else{
							C.messageInfo("This board is empty");
						}

						// Wake up the discovery space
						$('#discovery').show();
					},
				    error: function(model, error) {
						C.Views.Board.$el.hide();
						// Not found?
						if(response.status == '404'){
							C.messageWarn("Board not found");
						}else{
							C.messageError("An error occurred");
						}
				    }
				});
			});
		},
		// showView: function(View){
// 			if( ! View ){
// 				View.el.show();
// 			}
// 		},
// 		hideView: function(View){
// 			
// 		},
		destroyView: function(View){
			//COMPLETELY UNBIND THE VIEW
	    	View.undelegateEvents();
	    	View.$el.removeData().unbind(); 
	    	//Remove view from DOM
	    	View.remove();  
	    	Backbone.View.prototype.remove.call(View);
		},
		// FIXME THIS IS THE UGLIEST THING EVER...
		cleanUI: function(cb){

			var C = this;
			if( !! C.Views.Welcome ) C.Views.Welcome.$el.hide();
			if( !! C.Views.Discovery ) C.Views.Discovery.$el.html('');
			if( !! C.Views.Board ) C.Views.Board.$el.hide();
			if( !! C.Views.Badge ) C.Views.Badge.$el.hide();
			if( !! C.Views.User ) C.Views.User.$el.hide();
			if( !! C.Views.Typetopic ) C.Views.Typetopic.$el.hide();
			
			
			// TODO This is ugly
			$('#discovery').hide();
			// TODO Move this to a view!
			$("#messages").html('');

			// Goa heade once finished
			cb.call();
		},
		createNewBoard: function(){
			var C = this;
			var board = new Board();
			board.save({id: 0}, {
				wait:true,
				    success:function(model, response) {
						C.navigate(board.get('id') + '/edit', {trigger:true});
				    },
				    error: function(model, error) {
						C.messageError('An error occurred');
				    }
			});
		},
		likeDBPediaItem: function(uri){
			var C = this;
			var lbl = uri.substr(uri.lastIndexOf('/') + 1);
			lbl = lbl.replace('_', ' ');
//			uri = base64_decode(decodeURIComponent(uri));
			C.messageProgress("Discovering around " + lbl);
			// Get the data about the entity
			var entity = new StanbolEntity();
			entity.fetchEntity(uri).done(function(){
				C.messageProgress("Looking up " + lbl);
				// Get list of entities from dbpedia
				entity.fetchRelated().done(function(){
					C.messageProgress("Searching related things " + lbl);
					// Index
					entity.indexEntity().done(function(){
						// Show something
						var disco = new DiscoveryCollection();
						disco.discover(entity.get('urn'), 10).done(function(stuff){
							if(stuff.result.length > 0){
								C.messageSuccess("Discovered something about " + lbl);
								new DiscoveryView({el: $("#discovery"), collection: disco}).render();								
							}else{
								C.messageInfo("Nothing about " + lbl);
							}
						});
					});
				});
			});			
		},
		moreLikeThis: function(model, weight){
			var uri = model.get('uri');
			var title = model.get('title');
			var times = (typeof weight === 'undefined' || !weight) ? 10 : weight;
			var C = this;
			if(C._likedItems.indexOf(uri) === -1) {
				C._likedItems.push(uri);
			}
			var disco = new DiscoveryCollection();
			disco.discover(uri, 10 * times).done(function(stuff){
				if(stuff.result.length > 0){
					C.messageSuccess("Discovered more like " + title );
					new DiscoveryView({el: $("#discovery"), collection: disco}).render();								
				}else{
					C.messageInfo("Nothing more like " + title );
				}
			});
		},
		// notifies that an Item has been found
		// returns true if it can be displayed, false if it is should not be
		found: function(uri){
			var C = this;
			if(C._foundItems.indexOf(uri) === -1) {
				C._foundItems.push(uri);
				return true;
			}else{
				return false;
			}
		},
		tack: function(item){
			var C = this;
			if(C.Board.tack(item.get('uri'))){
				C.messageSuccess("Added " + item.get('title') );
				return true;
			}
			// This should never happen...
			// TODO say to the user that the item has not been tacked
			return false;
		},
		untack: function(item, utcb){
			var C = this;
			// This item needs to be removed from the tacked ones
			if(C.Board.untack(item.get('uri'), function(success){
				if(success){
					C.messageSuccess("Removed " + item.get('title') );
					utcb();
				} else {
					C.messageError("Cannot remove " + item.get('title') );
				}
			}));
			return true;
		},
		discard: function(uri){
			var C = this;

			// This item needs to be discarded
			if(C._discardedItems.indexOf(uri) === -1) {
				C._discardedItems.push(uri);
				return true;
			}else{
				return false;
			}
		},
		// TODO distinguish messageProgress from messageDone
		messageInfo: function(msg){
			var m = $('<div class="alert alert-info"><i class="fa fa-info"></i></div>');
			m.append(' ' + msg);
			$('#messages').html(m);
			//m.delay(10000).fadeOut(3000);
			m.delay(3000).fadeOut(1000);
		},
		messageProgress: function(msg){
			var m = $('<div class="alert alert-warning"><i class="fa fa-cog fa-spin"></i></div>');
			m.append(' ' + msg);
			$('#messages').html(m);
			//m.delay(10000).fadeOut(3000);
		},
		messageSuccess: function(msg){
			var m = $('<div class="alert alert-success"><i class="fa fa-info"></i></div>');
			m.append(' ' + msg);
			$('#messages').html(m);
			m.delay(3000).fadeOut(1000);
		},
		messageWarn: function(msg){
			var m = $('<div class="alert alert-warning"><i class="fa fa-exlamation-triangle"></i></div>');
			m.append(' ' + msg);
			$('#messages').html(m);
		},
		messageError: function(msg){
			var m = $('<div class="alert alert-danger"><i class="fa fa-exlamation-circle"></i></div>');
			m.append(' ' + msg);
			$('#messages').html(m);
			//m.delay(10000).fadeOut(3000);
		},
		init: function(){
			
			// Encapsulate settings
			this.Settings = Settings;
			
			// Bootstrap backbone history (enables routing)
			Backbone.history.start();
			
			// Init User
			User.fetch();
		},
	});
	
	// We return the singleton instance
	return new Controller();
});