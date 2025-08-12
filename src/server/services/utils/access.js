"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSite = testSite;
var flagsMap_1 = require("../../models/sources/flagsMap");
var interfaces_1 = require("../../models/interfaces");
var child_process_1 = require("child_process");
function runCurlCommand(args) {
    return new Promise(function (resolve, reject) {
        var child = (0, child_process_1.spawn)("curl", args, { env: process.env });
        var stdout = "";
        var stderr = "";
        child.stdout.on("data", function (data) { return (stdout += data.toString()); });
        child.stderr.on("data", function (data) { return (stderr += data.toString()); });
        child.on("close", function () {
            if (stderr || !stdout)
                return reject(stderr || "No output");
            resolve(stdout.trim());
        });
    });
}
function testSite(site, port) {
    return __awaiter(this, void 0, void 0, function () {
        var curlArgs, ipArgs, _a, curlOutput, ipOutput, parsedCurl, parsedIp, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Testing: ".concat(site));
                    curlArgs = [
                        "-o",
                        "/dev/null",
                        "-s",
                        "-w",
                        interfaces_1.curlFormat,
                        "--socks5-hostname",
                        "localhost:".concat(port),
                        site,
                    ];
                    ipArgs = [
                        "-s",
                        "--socks5-hostname",
                        "localhost:".concat(port),
                        "http://www.geoplugin.net/json.gp?ip=IP_ADDRESS",
                    ];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all([
                            runCurlCommand(curlArgs),
                            runCurlCommand(ipArgs),
                        ])];
                case 2:
                    _a = _b.sent(), curlOutput = _a[0], ipOutput = _a[1];
                    console.log("this is the ip output", ipOutput);
                    parsedCurl = JSON.parse(curlOutput);
                    parsedIp = typeof ipOutput === "object" ? ipOutput : JSON.parse(ipOutput);
                    if (!parsedIp.geoplugin_request || !parsedIp.geoplugin_countryName)
                        throw new Error("Bad IP data");
                    parsedCurl.ip = parsedIp.geoplugin_request;
                    parsedCurl.country = getCountryCode(parsedIp.geoplugin_countryName);
                    return [2 /*return*/, parsedCurl];
                case 3:
                    err_1 = _b.sent();
                    console.warn("Failed testing ".concat(site, ":"), err_1);
                    return [2 /*return*/, {
                            namelookup: -1,
                            connect: -1,
                            starttransfer: -1,
                            total: -1,
                            url: site,
                            config_name: "",
                            config_raw: "",
                            country: "",
                            ip: "",
                            category: "",
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getCountryCode(name) {
    var _a;
    return (_a = flagsMap_1.FlagsMap[name]) !== null && _a !== void 0 ? _a : "Unknown";
}
