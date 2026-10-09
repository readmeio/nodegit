const fs = require("fs");
const JSON5 = require("json5");
const path = require("path");

function isBuildingForElectron(nodeRootDir) {
  if (!nodeRootDir) {
    return false;
  }

  const last = nodeRootDir.split(path.sep).pop();
  if (last && last.startsWith("iojs")) {
    return true;
  }

  try {
    // Not ideal, would love it if there were a full featured gyp package to do this operation instead.
    const { variables: { built_with_electron } } = JSON5.parse(
      fs.readFileSync(
        path.resolve(nodeRootDir, "include", "node", "config.gypi"),
        "utf8"
      )
    );

    return !!built_with_electron;
  } catch (e) {
    return false;
  }
}

if (require.main === module) {
  if (process.argv.length < 3) {
    process.exit(1);
  }

  process.stdout.write(isBuildingForElectron(process.argv[2]) ? "1" : "0");
}

module.exports = isBuildingForElectron;
