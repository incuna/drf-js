module.exports = function(config) {
  config.set({

    basePath: '.',

    frameworks: ['browserify', 'jasmine'],

    browserify: {
      debug: true,
      transform: [
        ['babelify', {presets: ['es2015']}]
      ]
    },

    files: [
      'tests/*-spec.js'
    ],

    preprocessors: {
      'tests/*-spec.js': 'browserify'
    },

    reporters: ['progress', 'dots'],

    colors: true,

    logLevel: config.LOG_INFO,

    browsers: ['Firefox'],

    singleRun: true
  })
}
