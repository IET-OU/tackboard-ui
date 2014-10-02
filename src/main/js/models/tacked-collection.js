define([           
   'backbone',
   '../settings',
   'models/discovery-item'
], function(Backbone, Settings, DiscoveryItem) {
   'use strict';

	return Backbone.Collection.extend({
      model: DiscoveryItem,
      // url: function(){
// 		  var board = Tackboard.Board;
// 		  return Settings.ApiBase + '/tacked/' + board.get('id');
// 	  },
//       parse: function(response) {
// 		 var items = [];
//          $.map(response.tacked, function(uri) {
// 			items.push(new DiscoveryItem({uri: uri, tacked: true}));
//          });
//          return items;
//       }

   });
});