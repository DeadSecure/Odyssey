"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.PortManger = void 0;
exports.findMultipleFreePorts = findMultipleFreePorts;
exports.getPortsByUsername = getPortsByUsername;
exports.getConfigLinkByPort = getConfigLinkByPort;
var net = __importStar(require("net"));
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var PortManager = /** @class */ (function () {
    function PortManager() {
        this.processMap = new Map();
    }
    PortManager.getInstance = function () {
        if (!this.instance) {
            this.instance = new PortManager();
        }
        return this.instance;
    };
    PortManager.prototype.add = function (name, pid) {
        this.processMap.set(name, pid);
    };
    PortManager.prototype.remove = function (name) {
        this.processMap.delete(name);
    };
    PortManager.prototype.get = function (name) {
        return this.processMap.get(name);
    };
    PortManager.prototype.list = function () {
        return Object.fromEntries(this.processMap);
    };
    PortManager.prototype.isAlive = function (name) {
        var pid = this.get(name);
        if (!pid)
            return false;
        try {
            process.kill(pid, 0);
            return true;
        }
        catch (_a) {
            return false;
        }
    };
    return PortManager;
}());
exports.PortManger = PortManager.getInstance();
/**
 * Finds a free TCP port by letting the OS assign one.
 */
function findFreePort() {
    return new Promise(function (resolve, reject) {
        var server = net.createServer();
        server.unref(); // Don't block the event loop
        server.on("error", reject);
        server.listen(0, function () {
            var address = server.address();
            if (typeof address === "object" && (address === null || address === void 0 ? void 0 : address.port)) {
                var port_1 = address.port;
                server.close(function () { return resolve(port_1); });
            }
            else {
                reject(new Error("Failed to get port"));
            }
        });
    });
}
/**
 * Finds a specific number of unique free ports.
 */
function findMultipleFreePorts(count) {
    return __awaiter(this, void 0, void 0, function () {
        var ports, port, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ports = new Set();
                    _a.label = 1;
                case 1:
                    if (!(ports.size < count)) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, findFreePort()];
                case 3:
                    port = _a.sent();
                    ports.add(port);
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.error("Error finding port:", err_1);
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 1];
                case 6: return [2 /*return*/, Array.from(ports)];
            }
        });
    });
}
function getPortsByUsername(username) {
    return __awaiter(this, void 0, void 0, function () {
        var ports_path, ports;
        return __generator(this, function (_a) {
            ports_path = path.join(process.cwd(), "configs", username, "ports.json");
            if (!fs.existsSync(ports_path)) {
                throw new Error("No ports.json file found");
            }
            ports = JSON.parse(fs.readFileSync(ports_path, "utf-8"));
            return [2 /*return*/, ports];
        });
    });
}
function getConfigLinkByPort(username, port) {
    return __awaiter(this, void 0, void 0, function () {
        var configs_path, configs, config;
        return __generator(this, function (_a) {
            configs_path = path.join(process.cwd(), "configs", username, username + ".json");
            if (!fs.existsSync(configs_path)) {
                throw new Error("No ".concat(username, ".json file found"));
            }
            configs = JSON.parse(fs.readFileSync(configs_path, "utf-8"));
            config = configs.find(function (config) { return config.port === port; });
            if (!config) {
                throw new Error("No config found for port");
            }
            return [2 /*return*/, config];
        });
    });
}
