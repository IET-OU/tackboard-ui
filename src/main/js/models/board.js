define(['backbone', '../settings'], function(Backbone, Settings) {
  return Backbone.Model.extend({
    url: function(){
		return Settings.ApiBase + '/board/id/' + this.get('id');	
    },
	isNew : function () { return this.get('id') === 0; },
	defaults:{
		id: 0,
		label: "Unnamed board",
		tacked: [],
		createdby: '',
		readonly: false
	},
	initialize: function(){
		
	},
	validate: function(attrs){
		// Do validation here
	},
	untack: function(uri, utcb){
		var tacked = this.get('tacked');
		if( (idx = tacked.indexOf(uri) ) !== -1){
			this.save({tacked: tacked},{
				patch: true, 
				success: function(){tacked.splice(idx, 1);utcb(true);}, 
				error:function(){utcb(false);}
			});
			return true;
		}else{
			return false;
		}
	},
	tack: function(uri, tcb){
		var tacked = this.get('tacked');
		if( tacked.indexOf(uri) === -1){
			this.save({tacked: tacked}, {
				patch: true, 
				success: function(){tacked.push(uri);tcb(true);}, 
				error:function(){tcb(false);}
			});
			return true;
		}else{
			return false;
		}	
	}
  });
});