'use strict';

var conf = require('json-config-reader').read('package.json');

conf.src = './src';
conf.dist = './dist';
conf.bower = './bower_components';
conf.icons = './icons';
conf.build = './tmp';

conf.chromePluginPath = conf.dist + '/chrome-plugin';
conf.chromePlugin = conf.chromePluginPath + '/' + conf.name;

conf.safariPluginPath = conf.dist + '/safari-plugin';
conf.safariPlugin = conf.safariPluginPath + '/' + conf.name;

conf.nativePath = conf.dist + '/native';
conf.native = conf.nativePath + '/' + conf.name;

module.exports = conf;