const isBuildingForElectron = require("./isBuildingForElectron");

const target = process.argv[2];
const nodeRootDir = process.argv[3];
const targetSpecified = !!target && target !== "none";

function standardForNodeMajor(majorVersion) {
  // Node 23+ V8 headers require C++20. Node 18–22 build as C++17.
  if (majorVersion >= 23) {
    return "20";
  }
  if (majorVersion >= 18) {
    return "17";
  }
  return "14";
}

function standardForElectronMajor(majorVersion) {
  // Electron 32+ is built with C++20; Electron 21–31 with C++17.
  if (majorVersion >= 32) {
    return "20";
  }
  if (majorVersion >= 21) {
    return "17";
  }
  return "14";
}

let cxxStandard = "14";

if (targetSpecified) {
  const majorVersion = Number.parseInt(target.split(".")[0], 10);
  // prebuildify always passes --target. That is a Node version unless the
  // headers (or npm runtime) say this is an Electron/NW.js build.
  const electronTarget =
    process.env.npm_config_runtime === "electron" ||
    process.env.npm_config_runtime === "node-webkit" ||
    isBuildingForElectron(nodeRootDir);

  cxxStandard = electronTarget
    ? standardForElectronMajor(majorVersion)
    : standardForNodeMajor(majorVersion);
} else {
  const abiVersion = Number.parseInt(process.versions.modules, 10) || 0;
  // Node 18 === 108, Node 20 === 115, Node 23 === 131
  if (abiVersion >= 131) {
    cxxStandard = "20";
  } else if (abiVersion >= 108) {
    cxxStandard = "17";
  }
}

process.stdout.write(cxxStandard);
