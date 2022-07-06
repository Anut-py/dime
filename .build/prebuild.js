const fs = require("fs");

if (fs.existsSync(__dirname + "/../out")) {
    fs.readdirSync(__dirname + "/../out").forEach((x) =>
        fs.rmSync(__dirname + "/../out/" + x, {
            recursive: true,
            force: true,
        })
    );
}
