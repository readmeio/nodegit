var path = require("path");
var local = path.join.bind(path, __dirname);

var exec = require(local("../utils/execPromise"));
var buildFlags = require(local("../utils/buildFlags"));

module.exports = async function prepareForBuild() {
  if (buildFlags.isGitRepo) {
    var submodules = require(local("submodules"));
    var generate = require(local("../generate"));
    return submodules().then(function () {
      return generate();
    });
  }
};

// Called on the command line
if (require.main === module) {
  module.exports().catch(function (e) {
    console.error("[nodegit] ERROR - Could not finish preinstall");
    console.error(e);
    process.exit(1);
  });
}
