define(['underscore', 'backbone', 'typeahead', '../settings'], function(_, Backbone, typeahead, Settings){
	return Backbone.View.extend({
		template: 'type-topic-template',
        initialize: function(){
			// we don't have model right now...
//			this.render();
//        	this.model.on('change', this.render, this);
        },
		render: function(){
			var template = _.template( $("#" + this.template).html() , {} );
		    this.$el.html( template );
			
			var ldpath = "label = rdfs:label[@en] :: xsd:string; comment = rdfs:comment[@en] :: xsd:string;"
			this.$el.find("input").typeahead({                                
				template: _.template('<%= label %>'),
				valueKey: 'label',
				
				remote: {
					url: Settings.StanbolBase + '/entityhub/site/dbpedia/find?name=%QUERY&limit=10&ldpath=' + encodeURIComponent(ldpath),
					filter: function (response) {
						var suggestions = [];
						for(var i in response.results){
							var o = {};
							var r = response.results[i];
							o.id = r.id;
							o.label = r.label[0].value;
							o.description = (typeof r.comment === 'undefined') ? '' : r.comment[0].value;
							suggestions.push(o);
						}
						//console.log("suggestions", suggestions);
						return suggestions;
				    }
				},
				limit: 10
			}).on('typeahead:selected', function(event, item){
				// console.log(" typeahead:selected", item);
//				+ "/" + encodeURIComponent(item.id)
				Tackboard.likeDBPediaItem(item.id);
				//navigate("entity/" + 'dbpedia' + '/' + encodeURIComponent(base64_encode(item.id)), {trigger: true});
			});
		}
		,
		keyup: function(o){
			
		},
		events: {
			keyup : 'keyup',
		},
	});
});