/*jslint node: true */
'use strict';

module.exports = function (grunt) {
	grunt.initConfig({
		jshint: {
			 client: ['Gruntfile.js', 'js/*.js', '!js/*.min.js']
		},
		uglify: {
			test: {
				files: {
					'../js/textifyed.min.js': '../js/textifyed.js'
				}
			}
		},
		watch: {
			rebuild: {
				tasks: ['jshint:client', 'uglify:test'],
				files: ['Gruntfile.js', 'js/*.js', '!js/*.min.js']
			}
		},
		nodemon: {
			dev: {
				script: ['textifyed.js']
			}
		},
		concurrent: {
			dev: {
				tasks: ['nodemon', 'watch'],
				options: {
		          logConcurrentOutput: true
		        }
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.registerTask('local', ['concurrent']); //Concurrent will run jshint & uglify on change
	grunt.registerTask('minify', ['uglify']);
	grunt.registerTask('dev', ['uglify']);
};