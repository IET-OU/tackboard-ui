requirejs.config({
  baseUrl: 'js',

  paths: {
	  underscore: 'lib/underscore',
	  backbone: 'lib/backbone',
  	  jquery: 'lib/jquery',
  	  typeahead: 'lib/typeahead',	
  },

  shim: {
	  	'underscore': {
	        exports: '_'
		},
		'backbone': {
	        deps: [ 'jquery', 'underscore' ]
	    ,   exports: 'Backbone'
	    },
	    'controller': {
	        deps: ['underscore', 'backbone']
	    }
  },
});

// Load bootstrap dependencies
require([], function(){});

require(['commons', 'md5', 'controller'], function(a, b, Controller) {
  window.Tackboard = Controller;
  window.Tackboard.init();
});