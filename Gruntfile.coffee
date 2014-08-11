module.exports = (grunt) ->
  grunt.initConfig {
    pkg: grunt.file.readJSON 'package.json'
    uglify: {
      options: {
        sourceMap: '<% filename %>.map'
        banner: '/*<%= pkg.name %> <%= grunt.template.today("mm-dd-yyyy") %>*/\n'
      }
    }
    coffee: {
      options: {
        sourceMap: true
        bare: true
      }
      compile: {
        files: {
          '': ['']
        }
      }
    }
    compass: {
      dist: {
        options: {
          sassDir: ''
          cssDir: ''
        }
      }
    }
    copy: {
      main: {
        files: [
          {expand: true, flatten: true, src: [], dest: '', filter: 'isFile'}
        ]
      }
    }
    clean: ['out/']

    build: {
      # NA
    }
  }

  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-compass'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'default', ['clean', 'uglify','compass', 'coffee', 'copy' ]
