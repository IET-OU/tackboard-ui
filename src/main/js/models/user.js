define(['backbone', '../settings'], function(Backbone, Settings) {
  var User = Backbone.Model.extend({
    url: Settings.UserBase + '/user',
	defaults:{
		label: "Anonym User",
		email: "",
		name: "",
		user: "",
		uri: "",
		logoffurl: "#",
		boards: []
	},
	initialize: function(){
	},
  });
  
  // This is a singleton!
  var o = new User();
  // we force reloading of user data on reset
  o.bind('reset', function () { this.fetch(); });
  return o;
});