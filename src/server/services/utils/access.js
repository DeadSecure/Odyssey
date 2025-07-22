"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSite = testSite;
var interfaces_1 = require("../../models/interfaces");
var child_process_1 = require("child_process");
function testSite(site, port) {
    return new Promise(function (resolve) {
        console.log("Testing: ".concat(site));
        var curlArgs = [
            "-o", "/dev/null",
            "-s",
            "-w", interfaces_1.curlFormat,
            "--socks5-hostname",
            "localhost:".concat(port),
            site,
        ];
        var child = (0, child_process_1.spawn)("curl", curlArgs, { env: process.env });
        var stdout = "";
        var stderr = "";
        child.stdout.on("data", function (data) {
            stdout += data.toString();
        });
        child.stderr.on("data", function (data) {
            stderr += data.toString();
        });
        child.on("close", function () {
            if (stderr || !stdout) {
                console.error("Error testing ".concat(site, ": ").concat(stderr));
                return resolve({
                    namelookup: -1,
                    connect: -1,
                    starttransfer: -1,
                    total: -1,
                    url: "",
                    config_name: "",
                    config_raw: "",
                });
            }
            try {
                var parsed = JSON.parse(stdout.trim());
                resolve(parsed);
            }
            catch (e) {
                console.warn("Failed to parse response for ".concat(site, ":"), e);
                resolve({
                    namelookup: -1,
                    connect: -1,
                    starttransfer: -1,
                    total: -1,
                    url: "",
                    config_name: "",
                    config_raw: "",
                });
            }
        });
    });
}
// upload
// curl -s -T 2mb.pdf \
//   -w "{\"speed_upload\": %{speed_upload}, \"time_total\": %{time_total}}\n" \
//   --socks5-hostname localhost:1080 https://httpbin.org/post \
//   -o /dev/null
// download
// curl -o /dev/null -s \
// -w '{"speed_download": %{speed_download}, "speed_upload": %{speed_upload}}\n' \
//  --socks5-hostname localhost:1080 https://cachefly.cachefly.net/2mb.test
