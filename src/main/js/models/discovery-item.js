define([
   'backbone',
   'settings'
], function(Backbone, Settings) {
   'use strict';

	return Backbone.Model.extend({
	  _endpoint: Settings.DataOpenEndpoint,
	  idAttribute: 'uri',
	  url: function(){
		  var uri = this.get('uri');
		  if(typeof uri === 'undefined') return '';
		  var q = [
		  'construct { <', uri, '> ?predicate ?value } where { <', uri, '> ?predicate ?value } '
		  ].join('');
		 return this._endpoint + '?query=' + encodeURIComponent(q);
	  },
      defaults: {
		  uri: '',
		  title: '',
		  type: '',
		  cssClass: '',
		  depiction: '',
		  description: '',
		  topics: [],
		  link: '',
		  tacked: false,
		  readonly: false
      },
	  parse: function(response, xhr){
		  var data = {};
		  if(xhr.xhr.readyState === 4){
			  var uri = this.get('uri');
			   if(typeof uri === 'undefined') return {};
			  data.uri = uri;
			  var udata = response[uri];
			  
			  if(typeof udata === 'undefined'){
				  return data;
			  }
			  
			  // Choose type
			  if( uri.indexOf('http://data.open.ac.uk/openlearn/') === 0 ){
				  data.type = 'Unit';
			  }else if( uri.indexOf('http://data.open.ac.uk/openlearnexplore/') === 0 ){
				  data.type = 'Explore';
			  }else if( uri.indexOf('http://data.open.ac.uk/podcast/') === 0 ){
				  data.type = 'Podcast';
			  }
			  // title
			  if(typeof udata['http://purl.org/dc/terms/title'] !== 'undefined'){
				  data.title = udata['http://purl.org/dc/terms/title'][0].value;
			  }else if(typeof udata['http://www.w3.org/2000/01/rdf-schema#label'] !== 'undefined'){
				  data.title = udata['http://www.w3.org/2000/01/rdf-schema#label'][0].value;
			  }
			  // depiction
			  if(typeof udata['http://digitalbazaar.com/media/depiction'] !== 'undefined'){
				  data.depiction = udata['http://digitalbazaar.com/media/depiction'][0].value;
			  }
			  // link
			  if(typeof udata['http://www.w3.org/TR/2010/WD-mediaont-10-20100608/locator'] !== 'undefined'){
				  data.link = udata['http://www.w3.org/TR/2010/WD-mediaont-10-20100608/locator'][0].value;
			  }else if(typeof udata['http://dbpedia.org/property/url'] !== 'undefined'){
			  	  data.link = udata['http://dbpedia.org/property/url'][0].value;
			  }
			  // description
			  if(typeof udata['http://purl.org/dc/terms/description'] !== 'undefined'){
				  data.description = udata['http://purl.org/dc/terms/description'][0].value;
			  }else if(typeof udata['http://www.w3.org/2000/01/rdf-schema#comment'] !== 'undefined'){
			  	  data.description = udata['http://www.w3.org/2000/01/rdf-schema#comment'][0].value;
			  } 
			  // topics
			  if(typeof udata['http://purl.org/dc/terms/subject'] !== 'undefined'){
				  data.topics = [];
				  _.forEach(udata['http://purl.org/dc/terms/subject'], function(t){
					  data.topics.push(t.value.substring(t.value.lastIndexOf('/')+1));
				  });
			  }
			  
		  }else{
			  data = response;
		  }
		  return data;
	  }
		// 	  fetch: function(options){
		// var options = (options ||{});
		// options.method = 'GET';
		// options.headers = {Accept: 'application/rdf+json'};
		// options.url = this.get('uri');
		// 	  	return this.constructor.__super__.fetch.apply(this, options);
		// 	  }
   });
});