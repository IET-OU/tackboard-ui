define([           
   'backbone',   
   'models/discovery-item',
   'settings'
], function(Backbone, DiscoveryItem, Settings) {
   'use strict';

	return Backbone.Collection.extend({
      model: DiscoveryItem,
      url: Settings.DiscouBase + "/search",

	  discover: function(urn, nb) {
		  var c = this;
	  	return this.fetch({dataType: 'text' , dataFilter: function(data) {
	  		// should be a string array
			data = '{"result": ' + data + '}';
			data = removeAt(data, data.lastIndexOf(','));
			return $.parseJSON(data);
	  	}, data: {uri: urn, nb: nb} }).done(function(){
			// 
	  	});
	  },
      parse: function(response) {
		 var items = [];
         $.map(response.result, function(uri) {
			// Skip existing items
			if(Tackboard.found(uri)){
				items.push(new DiscoveryItem({uri: uri}));				
			}
         });
         return items;
      }

   });
});