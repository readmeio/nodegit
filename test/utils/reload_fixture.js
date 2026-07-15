// Evaluates lib/nodegit.js twice in one process, the way Jest does (fresh JS module
// registry per test file, shared native binding), then exercises methods that earlier
// versions would re-promisify. Exits non-zero if any DEP0174 warning is emitted.
var path = require("path");

var libDir = path.resolve(__dirname, "..", "..", "lib");
var nodegitPath = path.join(libDir, "nodegit.js");
var projectRepoPath = path.resolve(__dirname, "..", "..");

var warningCount = 0;
process.on("warning", function(warning) {
  if (warning.code === "DEP0174") {
    warningCount++;
  }
});

// The native .node binding stays cached (it is a process-wide singleton no matter what);
// only the package's JS modules are re-evaluated.
function purgePackageJsFromCache() {
  Object.keys(require.cache).forEach(function(key) {
    var isNativeModule = key.slice(-5) === ".node";
    var isPackageJs = key.indexOf(libDir) === 0 ||
      key.indexOf("node-gyp-build") !== -1;

    if (!isNativeModule && isPackageJs) {
      delete require.cache[key];
    }
  });
}

var first = require(nodegitPath);

purgePackageJsFromCache();
var second = require(nodegitPath);

if (second === first) {
  console.error("fixture failed to re-evaluate nodegit");
  process.exit(2);
}

// A promisify layer wrapped around an already promise-returning function emits DEP0174 at
// call time, which is what we detect. Commit.lookup goes through the lookupWrapper
// extension, the layer that historically got re-promisified.
second.Repository.open(projectRepoPath)
  .then(function(repo) {
    return repo.getHeadCommit().then(function(commit) {
      return second.Commit.lookup(repo, commit.id());
    });
  })
  .catch(function(error) {
    console.error("fixture could not exercise lookups: " + error);
    process.exit(2);
  })
  .then(function() {
    setTimeout(function() {
      if (warningCount > 0) {
        console.error("DEP0174 warnings after re-evaluation: " + warningCount);
        process.exit(1);
      }

      process.exit(0);
    }, 100);
  });
