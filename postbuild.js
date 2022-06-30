const fs = require("fs");
const source = fs.readFileSync(__dirname + "/package.json").toString("utf-8");
const readme = fs.readFileSync(__dirname + "/README.md").toString("utf-8");
const license = fs.readFileSync(__dirname + "/LICENSE").toString("utf-8");
const sourceObj = JSON.parse(source);
delete sourceObj.scripts;
delete sourceObj.devDependencies;
if (sourceObj.main.startsWith("src/")) {
    sourceObj.main = sourceObj.main.slice(4).replace(".ts", ".js");
}
fs.writeFileSync(
    __dirname + "/out/package.json",
    Buffer.from(JSON.stringify(sourceObj, null, 2), "utf-8")
);
fs.writeFileSync(
    __dirname + "/out/version.txt",
    Buffer.from(sourceObj.version, "utf-8")
);
fs.writeFileSync(
    __dirname + "/out/README.md",
    Buffer.from(readme, "utf-8")
);
fs.writeFileSync(
    __dirname + "/out/LICENSE",
    Buffer.from(license, "utf-8")
);
