/** @license
 * RequireJS plugin for loading JSON files
 * - depends on Text plugin and it was HEAVILY "inspired" by it as well.
 * Author: Miller Medeiros
 * Version: 0.4.0 (2014/04/10)
 * Released under the MIT license
 * 
 * Patched (2013/10/10):
 * - supports JS-like comments which are beginning from /* or //
 */
define(['text'], function (text) {

    var CACHE_BUST_QUERY_PARAM = 'bust',
        CACHE_BUST_FLAG = '!bust',
        jsonParse = (typeof JSON !== 'undefined' && typeof JSON.parse === 'function') ? JSON.parse : function (val) {
            return eval('(' + val + ')'); //quick and dirty
        },
        PROTECTION_PREFIX = /^\)\]\}',?\n/,
        buildMap = {};

    function cacheBust(url) {
        url = url.replace(CACHE_BUST_FLAG, '');
        url += (url.indexOf('?') < 0) ? '?' : '&';
        return url + CACHE_BUST_QUERY_PARAM + '=' + Math.round(2147483647 * Math.random());
    }

    //API
    return {
        load: function(name, req, onLoad, config) {
            // Make sure file part of url ends with .json, add it if not
            name = name.replace(new RegExp("^[^?]*"), function(base) {
                return base.substr(-5) === ".json" ? base : base + ".json";
            });
            var url = req.toUrl(name);
            if (config.isBuild && (config.inlineJSON === false || name.indexOf(CACHE_BUST_QUERY_PARAM + '=') !== -1)) {
                //avoid inlining cache busted JSON or if inlineJSON:false
                onLoad(null);
            } else if (url.indexOf('empty:') === 0) {
                //and don't inline files marked as empty: urls
                onLoad(null);
            } else {
                text.get(url, 
                    function (data) {
                        // Need to check if the JSON data has been formatted for the JSON array security vulnerability
                        var cleaned_data = ('' + data).replace(PROTECTION_PREFIX, '');
                        cleaned_data = cleaned_data.replace(/\/\*.+?\*\/|\/\/[^\n\r]*/g, '');
                        var parsed = null;
                        try {
                            parsed = jsonParse(cleaned_data);
                            if (config.isBuild) {
                                buildMap[name] = parsed;
                            }
                            onLoad(parsed);
                        } catch (e) {
                            onLoad.error(e);
                            //onLoad(null);         -- should we really call onLoad???
                        }
                    },
                    onLoad.error, {
                        accept: 'application/json'
                    }
                );
            }
        },

        normalize: function (name, normalize) {
            // used normalize to avoid caching references to a "cache busted" request
            if (name.indexOf(CACHE_BUST_FLAG) !== -1) {
                name = cacheBust(name);
            }
            // resolve any relative paths
            return normalize(name);
        },

        // write method based on RequireJS official text plugin by James Burke
        // https://github.com/jrburke/requirejs/blob/master/text.js
        write: function (pluginName, moduleName, write) {
            if (moduleName in buildMap) {
                var content = buildMap[moduleName];
                write('define("' + pluginName + '!' + moduleName + '", function () { return ' + (content ? JSON.stringify(content) : content) + '; });\n');
            }
        }
    };
});
