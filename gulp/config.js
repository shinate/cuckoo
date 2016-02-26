'use strict';

var conf = require('json-config-reader').read('package.json');

module.exports = {
    'src': './src',
    'chromePluginPath': './dist/chrome-plugin',
    'chromePlugin': './dist/chrome-plugin/' + conf.name,
    'safariPluginPath': './dist/safari-plugin',
    'safariPlugin': './dist/safari-plugin/' + conf.name,
    'nativePath': './dist/native',
    'native': './dist/native/' + conf.name,
    'bower': './bower_components',
    'icons': './icons',
    'build': './tmp',
    'version': conf.version,
    'name': conf.name
};