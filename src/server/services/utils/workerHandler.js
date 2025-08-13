"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWorker = runWorker;
var worker_threads_1 = require("worker_threads");
function runWorker(workerPath, data) {
    return new Promise(function (resolve) {
        var worker = new worker_threads_1.Worker(workerPath, { workerData: data });
        worker.on("message", function (res) { return resolve(res); });
        worker.on("error", function () { return resolve([]); }); // ignore errors
        worker.on("exit", function (code) {
            if (code !== 0)
                console.warn("Worker exited with code ".concat(code));
        });
    });
}
