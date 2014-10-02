define([], function(){
	// get the base location of the app
	var uri = document.URL;
	var mode = 'tackboard';
	if(uri.match(/data.open.ac.uk/)){
		mode = (uri.match(/\/tackboard\//)) ? 'tackboard' : 'viewboard';
		return {
            UserBase: '/' + mode + '-api',
            ApiBase: '/' + mode + '-api',
            StanbolBase: '/tackboard-service/stanbol',
            DbpediaSparqlEndpoint: '/tackboard-service/dbpedia/sparql',
            DiscouBase: '/tackboard-service/discou-services/',
            DataOpenEndpoint: 'http://data.open.ac.uk/sparql'
		};
	}else{
		// these are my local settings @enridaga
		return {
			UserBase: 'http://localhost:85/tackboard-api',
			ApiBase: 'http://localhost:85/tackboard-api',
			StanbolBase: 'http://localhost:85/tackboard-service/stanbol',
			DbpediaSparqlEndpoint: 'http://dbpedia.org/sparql',
			DiscouBase: 'http://localhost:85/tackboard-service/discou-services/',
			DataOpenEndpoint: 'http://data.open.ac.uk/sparql'
		};
	}
	
});
