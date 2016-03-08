'use strict';

// Protractor configuration
var config = {
  specs: ['app/modules/*/tests/e2e/*.e2e.tests.js'],
  allScriptsTimeout: 20000,
  params: {
    baseUrl: 'http://localhost:9000'
    //baseUrl: 'http://52.90.95.236'
  }
};

if (process.env.JENKINS) {
  config.capabilities = {
    browserName: 'firefox'
  };
}

exports.config = config;
