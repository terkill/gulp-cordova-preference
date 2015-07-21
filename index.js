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
    gutil = require('gulp-util'),
    Config = require('cordova-config');

// export the module
module.exports = function(platform, name, value) {
    if (typeof platform === 'object' || (!value && typeof name !== 'object')) {
        value = name;
        name = platform;
        platform = undefined;
    }

    var project,
        prefs = name;

    if(typeof name !== 'object') {
        // If name is not an object, it is the key and value is the value
        prefs = {};
        prefs[name] = value;
    }

    return through.obj(function(file, enc, cb) {
        project = file;

        // Pipe the file to the next step
        this.push(file);

        cb();
    }, function(cb) {
        try {
            // Load the config.xml file
            var config = new Config(path.join(project.path, 'config.xml'));

            // Iterate over the preferences and update the preference
            for(var name in prefs) {
                if (platform) {
                    config.setPlatformPreference(platform, name, prefs[name]);
                }
                else {
                    config.setPreference(name, prefs[name]);
                }
            }

            // Write the config file
            config.write(cb);
        }
        catch(err) {
            cb(new gutil.PluginError('gulp-cordova-preference', err.message));
        }
    });
};
