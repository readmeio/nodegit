var path = require("path");
var childProcess = require("child_process");
var local = path.join.bind(path, __dirname);

describe("Reload", function() {
  // Jest (and anything else with a per-file module registry) evaluates lib/nodegit.js once
  // per test file inside a long-lived process while the native binding stays a process-wide
  // singleton. Re-evaluations must not re-promisify the shared native methods: each extra
  // util.promisify layer emits a DEP0174 deprecation warning on every call and leaks a
  // pending promise. Run in a child process so this suite's own module cache is untouched.
  it("does not re-promisify shared natives when re-evaluated in one process",
    function(done) {
      this.timeout(30000);

      var fixture = local("../utils/reload_fixture.js");
      childProcess.execFile(process.execPath, [fixture],
        function(error, stdout, stderr) {
          if (error) {
            done(new Error(
              "reload fixture exited with code " + error.code + "\n" + stdout + stderr
            ));
            return;
          }

          done();
        });
    });
});
