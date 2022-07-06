const execSync = require("child_process").execSync;
const readFileSync = require("fs").readFileSync;

const versions = JSON.parse(
    execSync("npm view @coined/dime versions -s")
        .toString()
        .replaceAll("'", '"')
);

const version = JSON.parse(readFileSync(__dirname + "/../package.json")).version;

if (versions.includes(version)) {
    console.error("✗ Version " + version + " already exists in npm.");
    process.exitCode = 1;
} else {
    console.log("✓ Version " + version + " is valid.");
}
