define(['backbone', 'settings'], function(Backbone, Settings){
    'use strict';

 	return Backbone.Model.extend({
 	  
       defaults: {
		  text: '',
		  uri: '',
 		  entities: '',
       },

	   fetchEntities: function(text) {
		   var uri = 'urn:discou:input:' + md5(text);
		   this.set({uri: uri, text: text});
            var options = {};
            //var data = (options.data || {});
            options.type = 'POST';
			options.url = Settings.DiscouBase + '/entities2';
			options.timeout = 100000;
			$.ajaxSetup({timeout:100000});
			options.data = (options.data || {});
			options.data.text = text;
            return this.fetch(options);
      },
	  
	  index: function(){
		  var options = {};
		  options.type = 'POST';
		  options.url = Settings.DiscouBase + '/index';
		  options.data = { uri: this.get('uri'), entities: this.get('entities')};
		  return this.fetch(options);
	  },
	  
      parse: function(response, xhr) {
		 if(typeof response.data == 'undefined'){
			 return response;
		 }
		 
         var self = this;
		 var entities = "";
         $.map(response.data, function(item) {
			entities += (new Array(parseInt(item.score) + 1)).join(item.uri+ " ");
         });
		 return {'entities': entities};
      }
	  
    });

});

