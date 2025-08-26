#!/usr/bin/env ts-node
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var figlet_1 = __importDefault(require("figlet"));
var gradient_string_1 = __importDefault(require("gradient-string"));
var inquirer_1 = __importDefault(require("inquirer"));
var child_process_1 = require("child_process");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var axios_1 = __importDefault(require("axios"));
var child_process_2 = require("child_process");
var util_1 = require("util");
function showLogo() {
    var text = figlet_1.default.textSync("ODYSSEY", { font: "Big" });
    console.log(gradient_string_1.default.pastel.multiline(text));
}
function waitForServer(url_1) {
    return __awaiter(this, arguments, void 0, function (url, retries, delay) {
        var i, _a;
        if (retries === void 0) { retries = 20; }
        if (delay === void 0) { delay = 3000; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < retries)) return [3 /*break*/, 7];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
                case 4:
                    _a = _b.sent();
                    console.log("\u23F3 Waiting for server... (".concat(i + 1, "/").concat(retries, ")"));
                    return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, delay); })];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7: throw new Error("Server did not start in time");
            }
        });
    });
}
var devProcess = null;
function addService() {
    return __awaiter(this, void 0, void 0, function () {
        var params_1, _a, _b, _c, err_1, BreathDelay, dirPath_1, files, count, page_content, config_content, generatedFile, configFile, err_2;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 10, , 11]);
                    params_1 = {
                        subLink: "",
                        name: "",
                        tgSupportId: "",
                    };
                    // Step 1: Ask user
                    _a = params_1;
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: "input",
                                name: "subLink",
                                message: "Enter the sub link(unlimited in days and traffic):",
                                validate: function (input) {
                                    return input.trim() !== "" || "sub link cannot be empty";
                                },
                            },
                        ])];
                case 1:
                    // Step 1: Ask user
                    _a.subLink = (_d.sent()).subLink;
                    if (params_1.subLink.trim().toLowerCase() === "back") {
                        return [2 /*return*/];
                    }
                    _b = params_1;
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: "input",
                                name: "name",
                                message: "Enter a name for this service:",
                                validate: function (input) { return input.trim() !== "" || "Name cannot be empty"; },
                            },
                        ])];
                case 2:
                    _b.name = (_d.sent()).name;
                    if (params_1.name.trim().toLowerCase() === "back") {
                        return [2 /*return*/];
                    }
                    _c = params_1;
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: "input",
                                name: "tgSupportId",
                                message: "Enter the Telegram support id (eg. @PolNetSupport):",
                                validate: function (input) {
                                    return input.trim() !== "" || "Telegram support id cannot be empty";
                                },
                            },
                        ])];
                case 3:
                    _c.tgSupportId = (_d.sent()).tgSupportId;
                    if (params_1.tgSupportId.trim().toLowerCase() === "back") {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: "confirm",
                                name: "pic",
                                message: function (answers) {
                                    return "make sure your profile pic is in: public/profilePic/".concat(params_1.name, ".png then press Enter");
                                },
                            },
                        ])];
                case 4:
                    _d.sent();
                    // Step 2: Start server
                    console.log("\n▶️ Starting Odyssey server...");
                    devProcess = (0, child_process_1.spawn)("npm", ["run", "dev", "-turbopack"], {
                        stdio: "ignore",
                        detached: true,
                    });
                    devProcess.on("error", function (err) {
                        console.error("❌ Failed to start Base odyssey server:", err.message);
                        process.exit(1);
                    });
                    devProcess.on("exit", function (code) {
                        if (code !== 0) {
                            console.error("\u274C Base odyssey server exited with code ".concat(code));
                        }
                    });
                    return [4 /*yield*/, waitForServer("http://localhost:3000/api/health").catch(function (err) {
                            console.error("❌ Server did not respond in time:", err.message);
                            process.exit(1);
                        })];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6:
                    _d.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, axios_1.default.post("http://localhost:3000/api/config", {
                            url: params_1.subLink,
                            name: params_1.name,
                        })];
                case 7:
                    _d.sent();
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _d.sent();
                    console.error("⚠️ Failed to send config:", err_1.message);
                    return [3 /*break*/, 9];
                case 9:
                    BreathDelay = 60;
                    dirPath_1 = "./configs/".concat(params_1.name, "/json");
                    try {
                        if (fs_1.default.existsSync(dirPath_1)) {
                            files = fs_1.default.readdirSync(dirPath_1);
                            count = files.filter(function (f) {
                                return fs_1.default.statSync(path_1.default.join(dirPath_1, f)).isFile();
                            }).length;
                            BreathDelay = count * 10 || BreathDelay;
                        }
                        else {
                            console.warn("⚠️ Config directory not found, using default BreathDelay");
                        }
                    }
                    catch (err) {
                        console.error("⚠️ Could not calculate BreathDelay:", err.message);
                    }
                    page_content = "import { GetStaticProps } from \"next\";\nimport { serverSideTranslations } from \"next-i18next/serverSideTranslations\";\nimport ClientBarsWrapper from \"@/components/ui/clientWrapper\";\nimport ClientLayout from \"@/components/layout/clientLayout\";\nimport { useEffect, useState } from \"react\";\nimport { latencyBar, AccessBar, statusBar } from \"@/server/models/client/bars\";\nimport { Categories, SitesTestResponse } from \"@/server/models/interfaces\";\nimport { parseAccessBars } from \"@/server/services/utils/parser\";\nimport { FSLogger } from \"@/server/services/utils/logger\";\nimport {\n  fetchAccessAndStatusBars,\n  fetchLatencyBars,\n} from \"@/server/services/utils/bridge\";\ntype Props = {\n  AccessBars: AccessBar[];\n  LatencyBars: latencyBar[];\n  StatusBars: statusBar;\n  breathDelay: number;\n};\nimport raw_config from \"./config.json\";\nimport { ProviderConfig } from \"@/server/models/client/provider\";\nimport axios from \"axios\";\nimport CoreDownOverlay from \"@/components/ui/coreNotRunnings\";\nconst config: ProviderConfig = raw_config;\n\nexport default function Page({\n  AccessBars,\n  StatusBars,\n  LatencyBars,\n  breathDelay,\n}: Props) {\n  const [accessBars, setAccessBars] = useState<AccessBar[]>(AccessBars);\n  const [latencyBars, setLatencyBars] = useState<latencyBar[]>(LatencyBars);\n  const [statusBars, setStatusBars] = useState<statusBar>(StatusBars);\n  const [coreStatus, setCoreStatus] = useState<boolean>(true);\n  \n  const [breathDelayToPass, setBreathDelayToPass] =\n    useState<number>(breathDelay);\n  const [previousBars, setPreviousBars] = useState<{\n    AccessBars: AccessBar[];\n    LatencyBars: latencyBar[];\n    StatusBars: statusBar;\n  }>({ AccessBars, LatencyBars, StatusBars });\n  const [timeToRender, setTimeToRender] = useState<boolean>(true);\n  useEffect(() => {\n    const tab_knob = document.querySelector(\".tab-knob\");\n    const mode = document.querySelector(\".toggle-knob\")?.classList;\n    if (tab_knob && mode) {\n      if (mode.contains(\"dark\")) {\n        tab_knob.classList.add(\"dark\");\n        tab_knob.classList.remove(\"light\");\n      } else if (mode.contains(\"light\")) {\n        tab_knob.classList.add(\"light\");\n        tab_knob.classList.remove(\"dark\");\n      }\n    }\n    if (!timeToRender) return;\n    const fetchData = async () => {\n    const res: Record<string, number> = (\n        await axios.get(\"/api/cores\")\n      ).data;\n\n      if (!res[`${config.name}_core`]) {\n        console.error(\n          `\u274C Service ${config.name} is not running, start it before stopping it.`\n        );\n        setCoreStatus(false);\n        return;\n  } else {\n        setCoreStatus(true);\n  }\n\n      setAccessBars(previousBars.AccessBars);\n      setLatencyBars(previousBars.LatencyBars);\n      setStatusBars(previousBars.StatusBars);\n      const access_and_status = await fetchAccessAndStatusBars(config.name);\n      const latency = await fetchLatencyBars(config.name);\n      setPreviousBars({\n        AccessBars: access_and_status.access,\n        LatencyBars: latency,\n        StatusBars: access_and_status.status,\n      });\n      setTimeToRender(false);\n      setBreathDelayToPass((prev) =>\n        prev === breathDelay ? prev - 1 : breathDelay\n      );\n      setTimeout(() => setTimeToRender(true), breathDelay * 1000);\n    };\n    fetchData();\n  }, [timeToRender, breathDelay]);\n  return (\n    <ClientLayout\n      name={config.name}\n      logo={`/profilePic/${config.name}.png`}\n      bars={{\n        AccessBars: accessBars,\n        latencyBars: latencyBars,\n        statusBars: statusBars,\n      }}\n      delay={breathDelayToPass}\n      support_link={config.tg_support_link}\n    >\n      {coreStatus ? (\n              <ClientBarsWrapper />\n            ) : (\n              <CoreDownOverlay link={config.tg_support_link} />\n            )}\n    </ClientLayout>\n  );\n}\nexport const getStaticProps: GetStaticProps = async ({ locale }) => {\n  let access_and_status = await fetchAccessAndStatusBars(config.name);\n  const logger = new FSLogger(`${config.name}Logs`);\n  logger.log({\n    access: access_and_status.access,\n    status: access_and_status.status,\n  });\n  let latency = await fetchLatencyBars(config.name);\n  return {\n    props: {\n      AccessBars: access_and_status.access,\n      StatusBars: access_and_status.status,\n      LatencyBars: latency,\n      breathDelay: 40,\n      ...(await serverSideTranslations(locale ?? \"en\", [\"common\"])),\n    },\n    revalidate: 60,\n  };\n};";
                    config_content = "{\n  \"name\": \"".concat(params_1.name, "\",\n  \"subscription_link\": \"").concat(params_1.subLink, "\",\n  \"tg_support_link\": \"https://t.me/").concat(params_1.tgSupportId.replace("@", ""), "\"\n}");
                    try {
                        if (!fs_1.default.existsSync(path_1.default.join(process.cwd(), "pages/".concat(params_1.name)))) {
                            fs_1.default.mkdirSync(path_1.default.join(process.cwd(), "pages/".concat(params_1.name)), {
                                recursive: true,
                            });
                        }
                        generatedFile = path_1.default.join(process.cwd(), "pages/".concat(params_1.name, "/index.tsx"));
                        fs_1.default.writeFileSync(generatedFile, page_content);
                        console.log("\u2705 Generated ".concat(params_1.name, " home page"));
                        configFile = path_1.default.join(process.cwd(), "pages/".concat(params_1.name, "/config.json"));
                        fs_1.default.writeFileSync(configFile, config_content);
                        console.log("\u2705 Generated ".concat(params_1.name, " config file"));
                    }
                    catch (err) {
                        console.error("⚠️ Failed to generate file:", err.message);
                    }
                    devProcess.on("spawn", function () {
                        console.log("\n \uD83E\uDDDC\u200D\u2642\uFE0F Base odyssey server started successfully! See it at: http://localhost:3000/\n");
                    });
                    console.log("\n ".concat(params_1.name, " monitoring services added successfully!, run it from the main menu\n"));
                    return [2 /*return*/];
                case 10:
                    err_2 = _d.sent();
                    console.error("❌ Fatal error:", err_2.message);
                    process.exit(1);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function startService() {
    return __awaiter(this, void 0, void 0, function () {
        var items, items_list, choice_1, res, BreathDelay_1, dirPath_2, files, count, err_3;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    items = fs_1.default.readdirSync(path_1.default.join(process.cwd(), "pages"), {
                        withFileTypes: true,
                    });
                    items_list = items
                        .filter(function (item) { return item.isDirectory(); })
                        .filter(function (dir) { return dir.name != "api"; });
                    if (items_list.length === 0) {
                        console.error("❌ No service found, add one first");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: "list",
                                name: "choice",
                                message: "Select a Service:",
                                choices: __spreadArray(__spreadArray([], __read(items_list.map(function (item) { return item.name; })), false), [
                                    new inquirer_1.default.Separator(),
                                    "⬅️ Back",
                                ], false),
                            },
                        ])];
                case 1:
                    choice_1 = (_a.sent()).choice;
                    if (choice_1 === "⬅️ Back") {
                        return [2 /*return*/]; // just return to mainMenu
                    }
                    return [4 /*yield*/, waitForServer("http://localhost:3000/api/health", 3).catch(function (err) {
                            console.error("❌ Looks like the Base odyssey server is offline");
                        })];
                case 2:
                    _a.sent();
                    console.log("\n▶️ Starting Odyssey server...");
                    devProcess = (0, child_process_1.spawn)("npm", ["run", "dev", "-turbopack"], {
                        stdio: "ignore",
                        detached: true,
                    });
                    devProcess.on("error", function (err) {
                        console.error("❌ Failed to start Base odyssey server:", err.message);
                        return;
                    });
                    devProcess.on("exit", function (code) {
                        if (code !== 0) {
                            console.error("\u274C Base odyssey server exited with code ".concat(code));
                        }
                    });
                    return [4 /*yield*/, waitForServer("http://localhost:3000/api/health").catch(function (err) {
                            console.error("❌ Base odyssey Server did not respond in time:", err.message);
                            return;
                        })];
                case 3:
                    _a.sent();
                    console.log("🗿 Odyssey Base server running");
                    return [4 /*yield*/, axios_1.default.get("http://localhost:3000/api/cores")];
                case 4:
                    res = (_a.sent()).data;
                    if (res["".concat(choice_1, "_core")]) {
                        console.error("\u274C Service ".concat(choice_1, " is already running on port ").concat(res[choice_1], ". stop it first before starting it again."));
                        return [2 /*return*/];
                    }
                    BreathDelay_1 = 60;
                    dirPath_2 = "./configs/".concat(choice_1, "/json");
                    try {
                        if (fs_1.default.existsSync(dirPath_2)) {
                            files = fs_1.default.readdirSync(dirPath_2);
                            count = files.filter(function (f) {
                                return fs_1.default.statSync(path_1.default.join(dirPath_2, f)).isFile();
                            }).length;
                            BreathDelay_1 = count * 10 || BreathDelay_1;
                        }
                        else {
                            console.warn("⚠️ Config directory not found, using default BreathDelay");
                        }
                    }
                    catch (err) {
                        console.error("⚠️ Could not calculate BreathDelay:", err.message);
                    }
                    return [4 /*yield*/, new Promise(function (resolve) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var res_1, err_4;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, 3, 6]);
                                            console.log("\n starting ".concat(choice_1, " monitoring services..."));
                                            return [4 /*yield*/, axios_1.default.post("http://localhost:3000/api/runCore", new URLSearchParams({
                                                    username: choice_1,
                                                }), {
                                                    headers: {
                                                        "Content-Type": "application/x-www-form-urlencoded",
                                                    },
                                                })];
                                        case 1:
                                            res_1 = _a.sent();
                                            console.log("✅ Service responded:", res_1.data);
                                            return [3 /*break*/, 6];
                                        case 2:
                                            err_4 = _a.sent();
                                            console.error("⚠️ Could not reach service yet:", err_4.message);
                                            return [3 /*break*/, 6];
                                        case 3:
                                            console.log("\u23F3 Waiting ".concat(BreathDelay_1, " seconds for server to stabilize..."));
                                            return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, BreathDelay_1 * 1000); })];
                                        case 4:
                                            _a.sent();
                                            console.log("\n\uD83C\uDF89 ".concat(choice_1, " monitoring services started successfully! See it at: http://localhost:3000/").concat(choice_1, "\n"));
                                            return [4 /*yield*/, inquirer_1.default.prompt([
                                                    {
                                                        type: "confirm",
                                                        name: "back",
                                                        message: function (answers) { return "Press enter to back to main menu"; },
                                                    },
                                                ])];
                                        case 5:
                                            _a.sent();
                                            return [7 /*endfinally*/];
                                        case 6:
                                            resolve(null);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, 5000);
                        })];
                case 5: 
                // Step 6: Background request
                return [2 /*return*/, _a.sent()];
                case 6:
                    err_3 = _a.sent();
                    console.error("❌ Fatal error:", err_3.message);
                    return [2 /*return*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function stopService() {
    return __awaiter(this, void 0, void 0, function () {
        var items, items_list, choice, res, res_2, err_5, res_after;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, waitForServer("http://localhost:3000/api/health").catch(function (err) {
                        console.error("❌ Base odyssey Server did not respond in time:", err.message, "\n Please add a service first");
                        return;
                    })];
                case 1:
                    _a.sent();
                    items = fs_1.default.readdirSync(path_1.default.join(process.cwd(), "pages"), {
                        withFileTypes: true,
                    });
                    items_list = items
                        .filter(function (item) { return item.isDirectory(); })
                        .filter(function (dir) { return dir.name != "api"; });
                    if (items_list.length === 0) {
                        console.error("❌ No service found, add one first");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: "list",
                                name: "choice",
                                message: "Select a Service:",
                                choices: __spreadArray(__spreadArray([], __read(items_list.map(function (item) { return item.name; })), false), [
                                    new inquirer_1.default.Separator(),
                                    "⬅️ Back",
                                ], false),
                            },
                        ])];
                case 2:
                    choice = (_a.sent()).choice;
                    if (choice === "⬅️ Back") {
                        return [2 /*return*/]; // just return to mainMenu
                    }
                    return [4 /*yield*/, axios_1.default.get("http://localhost:3000/api/cores")];
                case 3:
                    res = (_a.sent()).data;
                    if (!res["".concat(choice, "_core")]) {
                        console.error("\u274C Service ".concat(choice, " is not running, start it before stopping it."));
                        return [2 /*return*/];
                    }
                    console.log("\n\uD83D\uDED1 Stopping ".concat(choice, " monitoring services..."));
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, axios_1.default.post("http://localhost:3000/api/stopCore", new URLSearchParams({
                            username: choice,
                        }), {
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                        })];
                case 5:
                    res_2 = _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_5 = _a.sent();
                    console.error("⚠️ Failed to stop service:", err_5.message);
                    return [3 /*break*/, 7];
                case 7: return [4 /*yield*/, axios_1.default.get("http://localhost:3000/api/cores")];
                case 8:
                    res_after = _a.sent();
                    if (!res_after["".concat(choice, "_core")]) {
                        console.error("\u2705 Service ".concat(choice, " is stopped successfully!"));
                        return [2 /*return*/];
                    }
                    else {
                        console.error("\u274C could not stop the ".concat(choice, " monitoring services: UNKNOWN_ERROR"));
                        return [2 /*return*/];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// to be removed
// async function editService() {
//   const items = fs.readdirSync(path.join(process.cwd(), "pages"), {
//     withFileTypes: true,
//   });
//   const items_list = items
//     .filter((item) => item.isDirectory())
//     .filter((dir) => dir.name != "api");
//   if (items_list.length === 0) {
//     console.error("❌ No service found, add one first");
//     return;
//   }
//   const { choice } = await inquirer.prompt([
//     {
//       type: "list",
//       name: "choice",
//       message: "Select a Service:",
//       choices: [
//         ...items_list.map((item) => item.name),
//         new inquirer.Separator(),
//         "⬅️ Back",
//       ],
//     },
//   ]);
//   if (choice === "⬅️ Back") {
//     return; // just return to mainMenu
//   }
//   const { subLink, name, tgSupportId } = await inquirer.prompt([
//     {
//       type: "input",
//       name: "subLink",
//       message: "Enter the sub link(unlimited in days and traffic):",
//       validate: (input) => input.trim() !== "" || "Config link cannot be empty",
//     },
//     {
//       type: "input",
//       name: "name",
//       message: "Enter a name for this service:",
//       validate: (input) => input.trim() !== "" || "Name cannot be empty",
//     },
//     {
//       type: "input",
//       name: "tgSupportId",
//       message: "Enter the Telegram support id (eg. @PolNetSupport):",
//       validate: (input) =>
//         input.trim() !== "" || "Telegram support id cannot be empty",
//     },
//     {
//       type: "confirm",
//       name: "pic",
//       message: (answers) =>
//         `make sure your profile pic is in: public/profilePic/${answers.name}.png then press Enter`,
//     },
//   ]);
//   let config_content = `{
//   "name": "${name}",
//   "subscription_link": "${subLink}",
//   "tg_support_link": "https://t.me/${tgSupportId.replace("@", "")}"
// }`;
//   try {
//     if (fs.existsSync(path.join(process.cwd(), `pages/${choice}/config.json`))) {
//       fs.unlinkSync(path.join(process.cwd(), `pages/${choice}/config.json`));
//     }
//     // deleting first
//     fs.writeFileSync(
//       path.join(process.cwd(), `pages/${name}/config.json`),
//       config_content
//     );
//     console.log(`✅ Generated ${name} config file`);
//     return;
//   } catch (err: any) {
//     console.error("⚠️ Failed to generate config file:", err.message);
//     return;
//   }
// }
function deleteService() {
    return __awaiter(this, void 0, void 0, function () {
        var items, items_list, choice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    items = fs_1.default.readdirSync(path_1.default.join(process.cwd(), "pages"), {
                        withFileTypes: true,
                    });
                    items_list = items
                        .filter(function (item) { return item.isDirectory(); })
                        .filter(function (dir) { return dir.name != "api"; });
                    if (items_list.length === 0) {
                        console.error("❌ No service found, add one first");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: "list",
                                name: "choice",
                                message: "Select a Service:",
                                choices: __spreadArray(__spreadArray([], __read(items_list.map(function (item) { return item.name; })), false), [
                                    new inquirer_1.default.Separator(),
                                    "⬅️ Back",
                                ], false),
                            },
                        ])];
                case 1:
                    choice = (_a.sent()).choice;
                    if (choice === "⬅️ Back") {
                        return [2 /*return*/]; // just return to mainMenu
                    }
                    try {
                        if (fs_1.default.existsSync(path_1.default.join(process.cwd(), "pages/".concat(choice)))) {
                            fs_1.default.rmSync(path_1.default.join(process.cwd(), "pages/".concat(choice)), {
                                recursive: true,
                            });
                        }
                        if (fs_1.default.existsSync(path_1.default.join(process.cwd(), "".concat(choice, "Logs")))) {
                            fs_1.default.rmSync(path_1.default.join(process.cwd(), "".concat(choice, "Logs")), {
                                recursive: true,
                            });
                        }
                        if (fs_1.default.existsSync(path_1.default.join(process.cwd(), "configs/".concat(choice)))) {
                            fs_1.default.rmSync(path_1.default.join(process.cwd(), "configs/".concat(choice)), {
                                recursive: true,
                            });
                        }
                        console.log("\u2705 Deleted ".concat(choice, " service"));
                        return [2 /*return*/];
                    }
                    catch (err) {
                        console.error("⚠️ Failed to delete service:", err.message);
                        return [2 /*return*/];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function runningServices() {
    return __awaiter(this, void 0, void 0, function () {
        var res, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get("http://localhost:3000/api/cores")];
                case 1:
                    res = _a.sent();
                    console.log(res.data ? "✅ runnings services :" : "❌ No Services running.", res.data ? res.data : {});
                    return [2 /*return*/];
                case 2:
                    err_6 = _a.sent();
                    console.error("⚠️ Could not reach service yet:", err_6.message);
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function CheckAndBuildXrayCore() {
    return __awaiter(this, void 0, void 0, function () {
        var execAsync, goProjectDir, outputBinary, buildCmd, _a, stdout, stderr, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    execAsync = (0, util_1.promisify)(child_process_2.exec);
                    goProjectDir = path_1.default.resolve(process.cwd(), "src/server/services/core/xrayCore");
                    outputBinary = path_1.default.resolve(goProjectDir, "xray");
                    if (!!fs_1.default.existsSync(outputBinary)) return [3 /*break*/, 7];
                    console.error("❌ Xray Core is not built yet.");
                    console.log("Building Xray Core...");
                    buildCmd = "CGO_ENABLED=0 go build -o \"".concat(outputBinary, "\" -trimpath -buildvcs=false -ldflags=\"-s -w -buildid=\" -v ./main");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 6]);
                    return [4 /*yield*/, execAsync(buildCmd, {
                            cwd: goProjectDir,
                        })];
                case 2:
                    _a = _b.sent(), stdout = _a.stdout, stderr = _a.stderr;
                    if (stdout)
                        console.log(stdout);
                    if (stderr)
                        console.error(stderr);
                    console.log("✅ Xray binary built successfully at:", outputBinary);
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1000); })];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _b.sent();
                    console.error("❌ Build failed:", error_1);
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1000); })];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
                case 6: return [3 /*break*/, 9];
                case 7:
                    console.log("✅ Xray binary exists at:", outputBinary);
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1000); })];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
function mainMenu() {
    return __awaiter(this, void 0, void 0, function () {
        var choice, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, CheckAndBuildXrayCore()];
                case 1:
                    _b.sent();
                    console.clear();
                    showLogo();
                    console.log("\n🚀 Welcome to the Odyssey monitoring service admin wizard \n");
                    _b.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 15];
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: "list",
                                name: "choice",
                                message: "Select an option(type back at any step to go back to main menu):",
                                choices: [
                                    "Start Service",
                                    "Stop Service",
                                    // "Edit Service", // to be removed
                                    "Add Service",
                                    "Delete Service",
                                    "Running Services",
                                    "Exit",
                                ],
                            },
                        ])];
                case 3:
                    choice = (_b.sent()).choice;
                    if (choice === "Exit") {
                        shutdown("manual");
                        return [3 /*break*/, 15];
                    }
                    _a = choice;
                    switch (_a) {
                        case "Start Service": return [3 /*break*/, 4];
                        case "Stop Service": return [3 /*break*/, 6];
                        case "Add Service": return [3 /*break*/, 8];
                        case "Delete Service": return [3 /*break*/, 10];
                        case "Running Services": return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 14];
                case 4: return [4 /*yield*/, startService()];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 6: return [4 /*yield*/, stopService()];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 8: return [4 /*yield*/, addService()];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 10: return [4 /*yield*/, deleteService()];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, runningServices()];
                case 13:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 14: return [3 /*break*/, 2];
                case 15: return [2 /*return*/];
            }
        });
    });
}
// global safety nets
process.on("unhandledRejection", function (reason) {
    console.error("❌ Unhandled promise rejection:", reason);
    shutdown("unhandledRejection");
});
process.on("uncaughtException", function (err) {
    console.error("❌ Uncaught exception:", err.message);
    shutdown("uncaughtException");
});
process.on("SIGINT", function () { return shutdown("SIGINT"); }); // ctrl+c
process.on("SIGTERM", function () { return shutdown("SIGTERM"); }); // kill command
function shutdown(signal) {
    console.log("\n\uD83D\uDED1 Caught ".concat(signal, ", shutting down gracefully..."));
    if (devProcess && devProcess.pid) {
        console.log("⏹ Stopping Base odyssey server...");
        try {
            // Kill the entire process group (requires the minus sign!)
            process.kill(-devProcess.pid, "SIGTERM");
        }
        catch (err) {
            console.warn("⚠️ Failed to kill process group:", err.message);
        }
    }
    setTimeout(function () {
        console.log("👋 Goodbye!");
        process.exit(signal === "manual" ? 0 : 1);
    }, 1000);
}
mainMenu();
