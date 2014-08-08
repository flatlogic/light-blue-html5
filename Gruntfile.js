module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'compile-handlebars': {
            dynamicTemplateData: {
                template: 'source.hbs',
                templateData: {
                    "salutation": "Hallo",
                    "punctuation": ",",
                    "location": "Welt"
                },
                output: 'result.html'
            }
        },

        watch: {
            files: ['source.hbs'],
            tasks: ['compile-handlebars']
        }
    });

    grunt.loadNpmTasks('grunt-compile-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['compile-handlebars']);
    grunt.registerTask('dist-watch', ['watch']);

};