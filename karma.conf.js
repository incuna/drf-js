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

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Firefox'],

    singleRun: false,
  })
}
