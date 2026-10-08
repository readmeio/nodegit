const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const test = require("node:test");

const script = path.join(__dirname, "defaultCxxStandard.js");

function writeHeaders(builtWithElectron) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "nodegit-headers-"));
  const includeDir = path.join(root, "include", "node");
  fs.mkdirSync(includeDir, { recursive: true });
  const variables = builtWithElectron
    ? "{ 'variables': { 'built_with_electron': 1 } }"
    : "{ 'variables': { 'node_module_version': 137 } }";
  fs.writeFileSync(path.join(includeDir, "config.gypi"), variables);
  return root;
}

function cxxStandard(target, nodeRootDir, env) {
  const args = [script, target];
  if (nodeRootDir) {
    args.push(nodeRootDir);
  }
  // Drop an inherited Electron or NW.js runtime so Node fixtures stay Node
  // fixtures. Callers that need that runtime pass it in env.
  const childEnv = Object.assign({}, process.env);
  delete childEnv.npm_config_runtime;
  if (env) {
    Object.assign(childEnv, env);
  }
  const result = spawnSync(process.execPath, args, {
    encoding: "utf8",
    env: childEnv,
  });
  assert.strictEqual(result.status, 0, result.stderr);
  return result.stdout;
}

test("node prebuild targets use C++20 from Node 23 up", () => {
  const headers = writeHeaders(false);
  assert.strictEqual(cxxStandard("22.22.0", headers), "17");
  assert.strictEqual(cxxStandard("23.0.0", headers), "20");
  assert.strictEqual(cxxStandard("24.18.0", headers), "20");
  assert.strictEqual(cxxStandard("26.5.0", headers), "20");
});

test("electron targets keep the electron C++ mapping", () => {
  const headers = writeHeaders(true);
  assert.strictEqual(cxxStandard("24.0.0", headers), "17");
  assert.strictEqual(cxxStandard("31.7.7", headers), "17");
  assert.strictEqual(cxxStandard("32.2.0", headers), "20");
});

test("node prebuild targets ignore an inherited electron runtime", () => {
  const headers = writeHeaders(false);
  const previous = process.env.npm_config_runtime;
  process.env.npm_config_runtime = "electron";
  try {
    assert.strictEqual(cxxStandard("23.0.0", headers), "20");
    assert.strictEqual(cxxStandard("24.18.0", headers), "20");
    assert.strictEqual(
      cxxStandard("28.0.0", undefined, { npm_config_runtime: "electron" }),
      "17"
    );
    process.env.npm_config_runtime = "node-webkit";
    assert.strictEqual(cxxStandard("24.18.0", headers), "20");
  } finally {
    if (previous === undefined) {
      delete process.env.npm_config_runtime;
    } else {
      process.env.npm_config_runtime = previous;
    }
  }
});

test("npm electron runtime is treated as electron even without headers", () => {
  assert.strictEqual(
    cxxStandard("28.0.0", undefined, { npm_config_runtime: "electron" }),
    "17"
  );
  assert.strictEqual(
    cxxStandard("34.0.0", undefined, { npm_config_runtime: "electron" }),
    "20"
  );
});

test("an unspecified target follows the running Node ABI", () => {
  const abi = Number.parseInt(process.versions.modules, 10);
  const expected = abi >= 131 ? "20" : abi >= 108 ? "17" : "14";
  assert.strictEqual(cxxStandard("none"), expected);
});
