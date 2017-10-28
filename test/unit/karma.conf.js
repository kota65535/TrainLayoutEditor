// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

var webpackConfig = require('../../build/webpack.test.conf')

module.exports = function (config) {
  config.set({
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    basePath: '',
    mime: {
      'text/x-typescript': ['ts']
    },
    browsers: ['Chrome'],
    frameworks: ['jasmine'],
    reporters: ['spec', 'coverage'],
    files: [
      "specs/lib/*.ts",        // libraries that cannot be included in bundle.js (ex. Google API client library)
      "specs/**/*.spec.ts",    // all test files
    ],
    preprocessors: {
      'src/**/*': ['webpack', 'sourcemap'],           // build all files in src folder
      'specs/**/*.spec.ts': ['webpack', 'sourcemap'],  // all test files
      'spec_helper.ts': ['webpack', 'sourcemap'],  // spec helper
    },
    webpack: webpackConfig,
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'json' },
        { type: 'lcov', },
        { type: 'text-summary' }
      ]
    },
    colors: true,
    logLevel: config.INFO,
    autoWatch: false,
    concurrency: Infinity
  })
}
