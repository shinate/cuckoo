'use strict';

var conf = require('json-config-reader').read('package.json');

conf.src = './src';
conf.dist = './dist';
conf.dev = conf.src + '/dev';
conf.bower = './bower_components';
conf.icons = './icons';
conf.build = './tmp';

conf.chromePluginPath = conf.dist + '/chrome-plugin';
conf.chromePlugin = conf.chromePluginPath + '/' + conf.name;

conf.safariPluginPath = conf.dist + '/safari-plugin';
conf.safariPlugin = conf.safariPluginPath + '/' + conf.name;

conf.nativePath = conf.dist + '/native';
conf.native = conf.nativePath + '/' + conf.name;

// chrome exec file
conf.chromeApp = '/Applications/Google\\\ Chrome.app/Contents/MacOS/Google\\\ Chrome';

module.exports = conf;