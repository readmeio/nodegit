var _ = require("lodash");
var util = require("util");
var path = require("path");
var worker;

try {
  worker = require("worker_threads");
} catch (e) {}

var rawApi = require("node-gyp-build")(path.join(__dirname, ".."));

// The native binding is a process-wide singleton, so when this file is evaluated more than
// once in the same process the methods on the shared classes are no longer the raw
// callback-style natives: they are the promise-returning wrappers installed by an earlier
// evaluation (util.promisify below, or an extension such as lookupWrapper). Re-promisifying
// those makes every call emit a DEP0174 deprecation warning and leak a pending promise per
// extra layer, so only ever wrap the raw natives — anything else is already promise-based
// and is returned untouched.
var promisify = fn => { // jshint ignore:line
  if (typeof fn !== "function" ||
      !Function.prototype.toString.call(fn).includes("[native code]")) {
    return fn;
  }
  return util.promisify(fn);
};

// For disccussion on why `cloneDeep` is required, see:
// https://github.com/facebook/jest/issues/3552
// https://github.com/facebook/jest/issues/3550
// https://github.com/nodejs/node/issues/5016
rawApi = _.cloneDeep(rawApi);

// Native methods do not return an identifiable function, so we
// have to override them here
/* jshint ignore:start */
{% each . as idef %}
  {% if idef.type == 'struct' %}
    rawApi.{{ idef.jsClassName }} = util.deprecate(function {{ idef.jsClassName }}() {
      try {
        require("./deprecated/structs/{{ idef.jsClassName }}").call(this, rawApi);
      } catch (error) {/* allow these to be undefined */}
    }, "Instantiation of {{ idef.jsClassName }} is deprecated and will be removed in an upcoming version");
  {% endif %}
  {% if idef.type != "enum" %}

    {% if idef.functions.length > 0 %}
      var _{{ idef.jsClassName }}
        = rawApi.{{ idef.jsClassName }};
    {% endif %}

    {% each idef.functions as fn %}
      {% if fn.isAsync %}

        {% if fn.isPrototypeMethod %}

          var _{{ idef.jsClassName }}_{{ fn.jsFunctionName}}
            = _{{ idef.jsClassName }}.prototype.{{ fn.jsFunctionName }};
          _{{ idef.jsClassName }}.prototype.{{ fn.jsFunctionName }}
            = promisify(_{{ idef.jsClassName }}_{{ fn.jsFunctionName}});

        {% else %}

          var _{{ idef.jsClassName }}_{{ fn.jsFunctionName}}
            = _{{ idef.jsClassName }}.{{ fn.jsFunctionName }};
          _{{ idef.jsClassName }}.{{ fn.jsFunctionName }}
            = promisify(_{{ idef.jsClassName }}_{{ fn.jsFunctionName}});

        {% endif %}

      {% endif %}
    {% endeach %}

  {% endif %}
{% endeach %}

var _ConvenientPatch = rawApi.ConvenientPatch;
var _ConvenientPatch_hunks = _ConvenientPatch.prototype.hunks;
_ConvenientPatch.prototype.hunks = promisify(_ConvenientPatch_hunks);

var _ConvenientHunk = rawApi.ConvenientHunk;
var _ConvenientHunk_lines = _ConvenientHunk.prototype.lines;
_ConvenientHunk.prototype.lines = promisify(_ConvenientHunk_lines);

var _FilterRegistry = rawApi.FilterRegistry;
var _FilterRegistry_register = _FilterRegistry.register;
_FilterRegistry.register = promisify(_FilterRegistry_register);

var _FilterRegistry_unregister = _FilterRegistry.unregister;
_FilterRegistry.unregister = promisify(_FilterRegistry_unregister);

/* jshint ignore:end */

// Set the exports prototype to the raw API.
exports.__proto__ = rawApi;

var importExtension = function(name) {
  try {
    require("./" + name);
  }
  catch (unhandledException) {
    if (unhandledException.code != "MODULE_NOT_FOUND") {
      throw unhandledException;
    }
  }
};

// Load up utils
rawApi.Utils = {};
require("./utils/lookup_wrapper");
require("./utils/shallow_clone");

// Load up extra types;
require("./status_file");
require("./enums.js");

// Import extensions
// [Manual] extensions
importExtension("filter_registry");
{% each %}
  {% if type != "enum" %}
    importExtension("{{ filename }}");
  {% endif %}
{% endeach %}
/* jshint ignore:start */
{% each . as idef %}
  {% if idef.type != "enum" %}
    {% each idef.functions as fn %}
      {% if fn.useAsOnRootProto %}

        // Inherit directly from the original {{idef.jsClassName}} object.
        _{{ idef.jsClassName }}.{{ fn.jsFunctionName }}.__proto__ =
          _{{ idef.jsClassName }};

        // Ensure we're using the correct prototype.
        _{{ idef.jsClassName }}.{{ fn.jsFunctionName }}.prototype =
          _{{ idef.jsClassName }}.prototype;

        // Assign the function as the root
        rawApi.{{ idef.jsClassName }} =
          _{{ idef.jsClassName }}.{{ fn.jsFunctionName }};

      {% endif %}
    {% endeach %}
  {% endif %}
{% endeach %}
/* jshint ignore:end */

// Set version.
exports.version = require("../package").version;

// Expose Promise implementation.
exports.Promise = Promise;
