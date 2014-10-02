define([
	'../settings',
   'backbone'
], function(Settings, Backbone) {
   'use strict';

	return Backbone.Model.extend({
	  // FIXME Use configuration for the stanbol endpoint
	  _stanbol: Settings.StanbolBase + '/entityhub/site/dbpedia/entity',
	  _dbpedia: Settings.DbpediaSparqlEndpoint,
	  _discou: Settings.DiscouBase,
	  // XXX Nice to see that 4 of 8 properties of this items are identifiers... :)
	  url: '',
      idAttribute: "uri",

      defaults: {
         site: '',
		 uri: '',
		 urn: '',
         label: '',
		 description: '',
		 entities: []
      },

      _parseLabel : function (resp) {
		  var comment = resp.representation["http://www.w3.org/2000/01/rdf-schema#label"];
		  if(typeof comment !== 'undefined' && typeof comment[0] !== 'undefined' && typeof comment[0].value === 'string' ){
	          return comment[0].value;
		  }
		  return "";
      },
      _parseDescription : function (resp) {
		  var comment = resp.representation["http://www.w3.org/2000/01/rdf-schema#comment"];
		  if(typeof comment !== 'undefined' && typeof comment[0] !== 'undefined' && typeof comment[0].value === 'string' ){
	          return  comment[0].value;
		  }
		  return "";
      },
	  fetchEntity : function (uri){
		  this.parse = this._parseEntity;
		  this.url = this._stanbol + '?id=' + encodeURIComponent(uri);
		  return this.fetch();
	  },
	  fetchRelated : function(){
		  this.parse = this._parseRelated;
		  var uri = this.get('uri');
		  var q = [
		   'SELECT ?entity WHERE {',
		     'FILTER regex(?entity, \'^http://dbpedia.org\')',
		      '{',
		       'SELECT DISTINCT ?entity WHERE {',
		       '{ <', uri, '> ?p ?entity . filter ( isIRI( ?entity ) )  } UNION { ?entity ?p <', uri, '> }',
		      '} limit 1000',
		    '}',
		  '}'
		  ];
		  // Get list of entities from dbpedia
		  q = q.join('');
		  this.url = this._dbpedia + "?query=" + encodeURIComponent(q);
		  return this.fetch();
	  },
	  indexEntity : function (uri){
		  this.parse = this._parseIndex;
		  var urn = 'urn:scrapbook:input:' + md5(this.get('uri'));
		  this.set({urn: urn});
		  this.url = this._discou + 'index';
		  var ents = new Array(20).join(this.get('uri') + ' ');
		  ents += " " + this.get('entities').join(' ');
		  var options = { method: 'POST', data: { uri: urn, entities: ents} };
		  return this.fetch(options);
	  },
	  _parseEntity : function(resp, xhr) {
		  var o = {
			  uri: resp.id,
			  site: resp.site,
			  description: this._parseDescription(resp),
			  label: this._parseLabel(resp)
		  }
	      return o;
	    },
	  _parseRelated : function(resp, xhr) {
		  var o = {
			  entities: []
		  }
		  
		  if(typeof resp.results.bindings == 'object'){
	          $.map(resp.results.bindings, function(binding) {
				  o.entities.push(binding.entity.value);
	          });
		  }
	      return o;
	    },
		_parseIndex : function(resp, xhr){
			return resp;
		}
   });
});