'use strict';

/**
 * Represents the config.xml file
 *
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  14 May 2015
 */

// module dependencies
var fs = require('fs'),
    et = require('elementtree');

module.exports = (function() {

    var _this = {
        parse: function(file) {
            var contents = fs.readFileSync(file, 'utf-8');

            if(contents) {
                //Windows is the BOM. Skip the Byte Order Mark.
                contents = contents.substring(contents.indexOf('<'));
            }

            var doc = new et.ElementTree(et.XML(contents)),
                root = doc.getroot();

            if(root.tag !== 'widget') {
                throw new Error('config.xml has incorrect root node name (expected "widget", was "' + root.tag + '")');
            }

            return doc;
        }
    };

    function Config(file) {
        this._file = file;
        this._doc = _this.parse(file);
        this._root = this._doc.getroot();
    }

    Config.prototype.setPreference = function(name, value) {
        // Retrieve the correct preference
        var preference = this._doc.find('./preference/[@name="' + name + '"]');

        if(preference) {
            // If the preference already exists, remove it first
            this._root.remove(preference);
        }

        // Create the preference element
        preference = new et.Element('preference');
        preference.attrib.name = name;
        preference.attrib.value = value;

        this._root.append(preference);
    };

    Config.prototype.write = function(cb) {
        fs.writeFile(this._file, this._doc.write({indent: 4}), 'utf-8', cb);
    };

    Config.prototype.writeSync = function() {
        fs.writeFileSync(this._file, this._doc.write({indent: 4}), 'utf-8');
    };

    return Config;
})();
