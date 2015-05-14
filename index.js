'use strict';

/**
 * Add a cordova preference to your config.xml file.
 *
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  14 May 2015
 */

// module dependencies
var path = require('path'),
    through = require('through2'),
    Config = require('./lib/config');

// export the module
module.exports = function(name, value) {

    var project;

    return through.obj(function(file, enc, cb) {
        project = file;

        // Pipe the file to the next step
        this.push(file);

        cb();
    }, function(cb) {
        // Load the config.xml file
        var config = new Config(path.join(project.path, 'config.xml'));

        // Set the preference
        config.setPreference(name, value);

        // Write the config file
        config.write(cb);
    });
};
