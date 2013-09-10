/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    concat: {
      requester_js: {
        src: ['chrome/js/requester/**/*.js'],
        dest: 'chrome/js/requester.js'
      },
      requester_html: {
        src: [
        'chrome/html/requester/header.html',
        'chrome/html/requester/sidebar.html',
        'chrome/html/requester/main.html',
        'chrome/html/requester/loggers/*.html',
        'chrome/html/requester/modals/*.html',
        'chrome/html/requester/footer.html'
        ],
        dest: 'chrome/requester.html'
      },
      requester_tester: {
        src: [
        'chrome/html/requester/header.html',
        'chrome/html/requester/sidebar.html',
        'chrome/html/requester/main.html',
        'chrome/html/requester/modals/*.html',
        'chrome/html/requester/loggers/*.html',
        'chrome/html/requester/footer.html',
        'chrome/html/requester/tester.html'
        ],
        dest: 'chrome/tester.html'
      },

      test_runner_js: {
        src: ['chrome/js/test_runner/**/*.js'],
        dest: 'chrome/js/test_runner.js'
      },
      test_runner_html: {
        src: [
        'chrome/html/test_runner/header.html',
        'chrome/html/test_runner/sidebar.html',
        'chrome/html/test_runner/main.html',
        'chrome/html/test_runner/loggers/*.html',
        'chrome/html/test_runner/modals/*.html',
        'chrome/html/test_runner/footer.html'
        ],
        dest: 'chrome/test_runner.html'
      }
    },

    mindirect: {
      requester_js: {
        src: ['chrome/js/requester.js'],
        dest: 'chrome/js/requester.min.js'
      },

      test_runner_js: {
        src: ['chrome/js/test_runner.js'],
        dest: 'chrome/js/test_runner.min.js'
      }
    },

    watch: {
      requester_templates: {
        files: ['chrome/html/requester/templates/*'],
        tasks: ['handlebars']
      },

      requester_js: {
        files: ['chrome/js/requester/**/*.js'],
        tasks: ['concat:requester_js']
      },

      requester_html: {
        files: ['chrome/html/requester/*', 'chrome/html/requester/modals/*', 'chrome/html/requester/loggers/*'],
        tasks: ['concat:requester_html', 'concat:requester_tester']
      },

      requester_css: {
        files: ['chrome/css/requester/*.scss'],
        tasks: ['sass:requester_sass']
      },

      test_runner_templates: {
        files: ['chrome/html/test_runner/templates/*'],
        tasks: ['handlebars']
      },

      test_runner_js: {
        files: ['chrome/js/test_runner/**/*.js'],
        tasks: ['concat:test_runner_js']
      },

      test_runner_html: {
        files: ['chrome/html/test_runner/*', 'chrome/html/test_runner/modals/*', 'chrome/html/test_runner/loggers/*'],
        tasks: ['concat:test_runner_html']
      },

      test_runner_css: {
        files: ['chrome/css/test_runner/*.scss'],
        tasks: ['sass:test_runner_sass']
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },

    handlebars: {
      compile: {
        options: {
          partialsUseNamespace: true,
          namespace: 'Handlebars.templates',
          processPartialName: function(filePath) {
            var pieces = filePath.split("/");
            var name = pieces[pieces.length - 1].split(".")[0];
            return name;
          },
          processName: function(filePath) {
            var pieces = filePath.split("/");
            var name = pieces[pieces.length - 1].split(".")[0];
            return name;
          }
        },
        files: {
          "chrome/html/requester/templates.js": "chrome/html/requester/templates/*",
          "chrome/html/test_runner/templates.js": "chrome/html/test_runner/templates/*"
        }
      }
    },

    sass: {
      requester_sass: {
        files: {
          'chrome/css/requester/styles.css': 'chrome/css/requester/styles.scss'
        }
      },

      test_runner_sass: {
        files: {
          'chrome/css/test_runner/styles.css': 'chrome/css/test_runner/styles.scss'
        }
      }
    },

    compress: {
      main: {
          options: {
            archive: 'releases/v0.9.3.zip'
          },
          files: [
            {src: ['chrome/**', '!chrome/tests/**', '!chrome/manifest_key.json', '!chrome/tester.html'], dest: '/'}, // includes files in path and its subdirs
          ]
        }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mindirect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat']);
  grunt.registerTask('package', ['concat', 'handlebars', 'sass', 'compress']);

};