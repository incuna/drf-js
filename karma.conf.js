module.exports = function(config) {
  config.set({

    basePath: '.',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
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

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Firefox'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,
  })
}
