module.exports = function(grunt) {
var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;
  // config
  grunt.initConfig({
	  
	  less: {
	  	  preprocess: {
			  options: {
				  paths: ['src/main/less']
			  },
			  files: {
				  'src/main/css/styles.css' : 'src/main/less/styles.less'
			  }
	  	  }
	  },
	  
	  copy: {
		  dependencies: {
			files: [
				{
				cwd: 'node_modules',
					src: [ 
						'backbone/backbone.js', 
						'underscore/underscore.js', 
						'requirejs/require.js' ],
					dest: 'target/build/js/lib/',
	        		expand: true,
    				flatten: true,
				},
			  	{ src: 'src/var/typeahead.js/typeahead.js', dest: 'target/build/js/lib/typeahead.js', flatten: true },
			  	{ src: 'node_modules/jquery/dist/jquery.js', dest: 'target/build/js/lib/jquery.js', flatten: true },
			  	{ cwd: 'src/main/less/font-awesome-4.0.3/fonts', src: ['**'], dest: 'target/build/fonts/', expand:true, flatten: true },
			  	{ src: 'src/main/less/bootstrap-3.0.3/dist/js/bootstrap.min.js', dest: 'target/build/js/lib/bootstrap.min.js', flatten: true },
			]
		  },
	      sources: {
	          cwd: 'src/main',
	          src: [ '*.html', 'css/*', 'js/**', 'img/**' ],
	          dest: 'target/build',
	          expand: true
	      },
		  dev: {
	          cwd: 'src/dev/api',
	          src: [ '!**' ], // disabled
	          dest: 'target/build/tackboard-api',
	          expand: true
		  }
	  },
		
	  connect: {
		  server: {
		    options: {
			  keepalive: true,
		      port: 8000,
		      base: 'target/build',
		      hostname: '*',
              middleware: function (connect, options) {
				  // Init temp data
				
				if(typeof connect.__tmp == 'undefined'){
					connect.__tmp = {};
				}
				var db = connect.__tmp;
                return [
			    	function(req, res, next) {
						console.log(req.method + " " + req.url);
			             res.setHeader('Access-Control-Allow-Origin', '*');
			             res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
			             res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
						 // don't just call next() return it
			             return next();
			        },
                    rewriteRulesSnippet, // RewriteRules support
                    connect.static(require('path').resolve(options.base)), // mount filesystem
					// ... any other middleware
					// /board
					function(req, res, next){
						// /board/id/:id URL
						if(req.url.indexOf('/board')===-1) return next();
						if(req.url.indexOf('/board/id/notfound')!==-1) return next();
						
						if(req.method == 'PUT' || typeof db.board === 'undefined'){
							var o = {};
							// Create a fake id
							var uniq = 'id' + (new Date()).getTime();
							o.id = uniq;
							o.label = 'Unnamed board';
							o.createdBy = 'ed4565';
							o.tacked = ["http://data.open.ac.uk/openlearn/l550_3", "http://data.open.ac.uk/openlearn/l550_2", "http://data.open.ac.uk/openlearn/explore/ou-on-the-bbc-silverville-episode-5", "http://data.open.ac.uk/openlearn/explore/your-trip-killing-the-planet-0", "http://data.open.ac.uk/openlearn/explore/the-silverville-diaries-welcome-lovat-fields", "http://data.open.ac.uk/openlearn/explore/what-britains-most-sacred-site", "http://data.open.ac.uk/openlearn/explore/ou-on-the-bbc-silverville-episode-6", "http://data.open.ac.uk/openlearn/explore/ou-on-the-bbc-silverville-episode-3", "http://data.open.ac.uk/openlearn/explore/donate", "http://data.open.ac.uk/openlearn/explore/ou-on-the-bbc-silverville-episode-1" ];
							// Add to data
							db.board = o;
						}else if(req.method == 'PATCH'){
							// XXX Do nothing but patching
//							db.board.tacked = []; this is to test that the client updates its data
						}
						if(req.url)
						res.end(JSON.stringify(db.board))
					},
					// // /tacked
// 					function(req, res, next){
// 						// /tacked/:id URL
// 						if(req.url.indexOf('/tacked/')===-1) return next();
// 						/*
// 						var o = {};
// 						o.tacked = db.board.tacked;
// 						res.end(JSON.stringify(o))*/
// 						res.setHeader('Content-type', 'application/json; charset=utf-8');
// 						res.end('{"tacked": ["http://data.open.ac.uk/openlearn/l550_3", "http://data.open.ac.uk/openlearn/l550_2", "http://data.open.ac.uk/openlearn/explore/ou-on-the-bbc-silverville-episode-5", "http://data.open.ac.uk/openlearn/explore/your-trip-killing-the-planet-0", "http://data.open.ac.uk/openlearn/explore/the-silverville-diaries-welcome-lovat-fields", "http://data.open.ac.uk/openlearn/explore/what-britains-most-sacred-site", "http://data.open.ac.uk/openlearn/explore/ou-on-the-bbc-silverville-episode-6", "http://data.open.ac.uk/openlearn/explore/ou-on-the-bbc-silverville-episode-3", "http://data.open.ac.uk/openlearn/explore/donate", "http://data.open.ac.uk/openlearn/explore/ou-on-the-bbc-silverville-episode-1" ] }')
// 					},
// 					// /tacked
// 					function(req, res, next){
// 			            // /tacked/:id URL
// 						if(req.url.indexOf('/tack/')===-1) return next();
// 						return next();
// 					}
                      
                  ];
              },
		    },
			rules: [
				// Internal rewrite
			    { from: '^/fonts(([^\?]+)\?)$', to: '/fonts$1' },
			]
		  }
		},
		
	  clean: {
			target: {
			    src: [ 'target' ]
			  },
      },
	
  });
  
  // load the tasks
  
  // :less (preprocess css)
  grunt.loadNpmTasks('grunt-contrib-less');
  
  // :copy
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  // :clean
  grunt.loadNpmTasks('grunt-contrib-clean');

  // :connect
  grunt.loadNpmTasks('grunt-contrib-connect');
    
  // :build
  grunt.registerTask(
    'build', 
    'Compiles all of the assets and copies the files to the build directory.', 
    [ 'less', 'clean:target', 'copy:sources', 'copy:dependencies' ]
  );
  
  // :dev
  grunt.registerTask(
    'dev', 
    'Makes a build and runs a dev server with it', 
    [ 'build', 'copy:dev', 'connect' ]
  );
  
};