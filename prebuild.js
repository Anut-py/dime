const fs = require("fs");

if (fs.existsSync(__dirname + "/out")) {
    fs.rmSync(__dirname + "/out", {
        recursive: true,
        force: true
    });
}