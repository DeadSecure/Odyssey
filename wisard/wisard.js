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
                    console.log("🗿 Odyssey Base server running");
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
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, subLink, name_1, tgSupportId, err_1, BreathDelay_1, dirPath_1, files, count, page_content, config_content, generatedFile, configFile, err_2;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    showLogo();
                    console.log("\n🚀 Welcome to the Odyssey Service Setup Wizard\n");
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: "input",
                                name: "subLink",
                                message: "Enter the config link:",
                                validate: function (input) {
                                    return input.trim() !== "" || "Config link cannot be empty";
                                },
                            },
                            {
                                type: "input",
                                name: "name",
                                message: "Enter a name for this service:",
                                validate: function (input) { return input.trim() !== "" || "Name cannot be empty"; },
                            },
                            {
                                type: "input",
                                name: "tgSupportId",
                                message: "Enter the Telegram support id (eg. @PolNetSupport):",
                                validate: function (input) {
                                    return input.trim() !== "" || "Telegram support id cannot be empty";
                                },
                            },
                            {
                                type: "confirm",
                                name: "pic",
                                message: function (answers) {
                                    return "make sure your profile pic is in: public/profilePic/".concat(answers.name, ".png then press Enter");
                                },
                            },
                        ])];
                case 1:
                    _a = _b.sent(), subLink = _a.subLink, name_1 = _a.name, tgSupportId = _a.tgSupportId;
                    // Step 2: Start server
                    console.log("\n▶️ Starting Odyssey server...");
                    devProcess = (0, child_process_1.spawn)("npm", ["run", "dev"], { stdio: "inherit" });
                    devProcess.on("error", function (err) {
                        console.error("❌ Failed to start dev server:", err.message);
                        process.exit(1);
                    });
                    devProcess.on("exit", function (code) {
                        if (code !== 0) {
                            console.error("\u274C Dev server exited with code ".concat(code));
                        }
                    });
                    return [4 /*yield*/, waitForServer("http://localhost:3000/api/health").catch(function (err) {
                            console.error("❌ Server did not respond in time:", err.message);
                            process.exit(1);
                        })];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, axios_1.default.post("http://localhost:3000/api/config", {
                            url: subLink,
                            name: name_1,
                        })];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _b.sent();
                    console.error("⚠️ Failed to send config:", err_1.message);
                    return [3 /*break*/, 6];
                case 6:
                    BreathDelay_1 = 60;
                    dirPath_1 = "./configs/".concat(name_1, "/json");
                    try {
                        if (fs_1.default.existsSync(dirPath_1)) {
                            files = fs_1.default.readdirSync(dirPath_1);
                            count = files.filter(function (f) {
                                return fs_1.default.statSync(path_1.default.join(dirPath_1, f)).isFile();
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
                    page_content = "import { GetStaticProps } from \"next\";\nimport { serverSideTranslations } from \"next-i18next/serverSideTranslations\";\nimport ClientBarsWrapper from \"@/components/ui/clientWrapper\";\nimport ClientLayout from \"@/components/layout/clientLayout\";\nimport { useEffect, useState } from \"react\";\nimport { latencyBar, AccessBar, statusBar } from \"@/server/models/client/bars\";\nimport { Categories, SitesTestResponse } from \"@/server/models/interfaces\";\nimport { parseAccessBars } from \"@/server/services/utils/parser\";\nimport { FSLogger } from \"@/server/services/utils/logger\";\nimport {\n  fetchAccessAndStatusBars,\n  fetchLatencyBars,\n} from \"@/server/services/utils/bridge\";\ntype Props = {\n  AccessBars: AccessBar[];\n  LatencyBars: latencyBar[];\n  StatusBars: statusBar;\n  breathDelay: number;\n};\nimport raw_config from \"./config.json\";\nimport { ProviderConfig } from \"@/server/models/client/provider\";\nconst config: ProviderConfig = raw_config;\n\nexport default function Page({\n  AccessBars,\n  StatusBars,\n  LatencyBars,\n  breathDelay,\n}: Props) {\n  const [accessBars, setAccessBars] = useState<AccessBar[]>(AccessBars);\n  const [latencyBars, setLatencyBars] = useState<latencyBar[]>(LatencyBars);\n  const [statusBars, setStatusBars] = useState<statusBar>(StatusBars);\n  const [breathDelayToPass, setBreathDelayToPass] =\n    useState<number>(breathDelay);\n  const [previousBars, setPreviousBars] = useState<{\n    AccessBars: AccessBar[];\n    LatencyBars: latencyBar[];\n    StatusBars: statusBar;\n  }>({ AccessBars, LatencyBars, StatusBars });\n  const [timeToRender, setTimeToRender] = useState<boolean>(true);\n  useEffect(() => {\n    const tab_knob = document.querySelector(\".tab-knob\");\n    const mode = document.querySelector(\".toggle-knob\")?.classList;\n    if (tab_knob && mode) {\n      if (mode.contains(\"dark\")) {\n        tab_knob.classList.add(\"dark\");\n        tab_knob.classList.remove(\"light\");\n      } else if (mode.contains(\"light\")) {\n        tab_knob.classList.add(\"light\");\n        tab_knob.classList.remove(\"dark\");\n      }\n    }\n    if (!timeToRender) return;\n    const fetchData = async () => {\n      setAccessBars(previousBars.AccessBars);\n      setLatencyBars(previousBars.LatencyBars);\n      setStatusBars(previousBars.StatusBars);\n      const access_and_status = await fetchAccessAndStatusBars(config.name);\n      const latency = await fetchLatencyBars(config.name);\n      setPreviousBars({\n        AccessBars: access_and_status.access,\n        LatencyBars: latency,\n        StatusBars: access_and_status.status,\n      });\n      setTimeToRender(false);\n      setBreathDelayToPass((prev) =>\n        prev === breathDelay ? prev - 1 : breathDelay\n      );\n      setTimeout(() => setTimeToRender(true), breathDelay * 1000);\n    };\n    fetchData();\n  }, [timeToRender, breathDelay]);\n  return (\n    <ClientLayout\n      name={config.name}\n      logo={`/profilePic/${config.name}.png`}\n      bars={{\n        AccessBars: accessBars,\n        latencyBars: latencyBars,\n        statusBars: statusBars,\n      }}\n      delay={breathDelayToPass}\n      support_link={config.tg_support_link}\n    >\n      <ClientBarsWrapper />\n    </ClientLayout>\n  );\n}\nexport const getStaticProps: GetStaticProps = async ({ locale }) => {\n  let access_and_status = await fetchAccessAndStatusBars(config.name);\n  const logger = new FSLogger(\"polnetLogs\");\n  logger.log({\n    access: access_and_status.access,\n    status: access_and_status.status,\n  });\n  let latency = await fetchLatencyBars(config.name);\n  return {\n    props: {\n      AccessBars: access_and_status.access,\n      StatusBars: access_and_status.status,\n      LatencyBars: latency,\n      breathDelay: 40,\n      ...(await serverSideTranslations(locale ?? \"en\", [\"common\"])),\n    },\n    revalidate: 60,\n  };\n};";
                    config_content = "{\n  \"name\": \"".concat(name_1, "\",\n  \"subscription_link\": \"").concat(subLink, "\",\n  \"tg_support_link\": \"https://t.me/").concat(tgSupportId.replace("@", ""), "\"\n}");
                    try {
                        if (!fs_1.default.existsSync(path_1.default.join(process.cwd(), "pages/".concat(name_1)))) {
                            fs_1.default.mkdirSync(path_1.default.join(process.cwd(), "pages/".concat(name_1)), {
                                recursive: true,
                            });
                        }
                        generatedFile = path_1.default.join(process.cwd(), "pages/".concat(name_1, "/index.tsx"));
                        fs_1.default.writeFileSync(generatedFile, page_content);
                        console.log("\u2705 Generated ".concat(name_1, " home page"));
                        configFile = path_1.default.join(process.cwd(), "pages/".concat(name_1, "/config.json"));
                        fs_1.default.writeFileSync(configFile, config_content);
                        console.log("\u2705 Generated ".concat(name_1, " config file"));
                    }
                    catch (err) {
                        console.error("⚠️ Failed to generate file:", err.message);
                    }
                    // Step 6: Background request
                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        var res, err_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, 3, 5]);
                                    console.log("\n starting ".concat(name_1, " monitoring services..."));
                                    return [4 /*yield*/, axios_1.default.post("http://localhost:3000/api/runCore", new URLSearchParams({
                                            username: name_1,
                                        }), {
                                            headers: {
                                                "Content-Type": "application/x-www-form-urlencoded",
                                            },
                                        })];
                                case 1:
                                    res = _a.sent();
                                    console.log("✅ Service responded:", res.data);
                                    return [3 /*break*/, 5];
                                case 2:
                                    err_3 = _a.sent();
                                    console.error("⚠️ Could not reach service yet:", err_3.message);
                                    return [3 /*break*/, 5];
                                case 3:
                                    console.log("\u23F3 Waiting ".concat(BreathDelay_1, " seconds for server to stabilize..."));
                                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, BreathDelay_1 * 1000); })];
                                case 4:
                                    _a.sent();
                                    console.log("\n\uD83C\uDF89 ".concat(name_1, " monitoring services started successfully! See it at: http://localhost:3000/").concat(name_1, "\n"));
                                    return [7 /*endfinally*/];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); }, 5000);
                    devProcess.on("spawn", function () {
                        console.log("\n\uD83C\uDF89 Service started successfully! See it at: http://localhost:3000/\n");
                    });
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _b.sent();
                    console.error("❌ Fatal error:", err_2.message);
                    process.exit(1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// global safety nets
process.on("unhandledRejection", function (reason) {
    console.error("❌ Unhandled promise rejection:", reason);
});
process.on("uncaughtException", function (err) {
    console.error("❌ Uncaught exception:", err.message);
});
function shutdown(signal) {
    console.log("\n\uD83D\uDED1 Caught ".concat(signal, ", shutting down gracefully..."));
    if (devProcess) {
        console.log("⏹ Stopping Base odyssey server...");
        devProcess.kill("SIGTERM"); // send TERM to child
    }
    // Give child a moment to exit, then exit self
    setTimeout(function () {
        console.log("👋 Goodbye!");
        process.exit(0);
    }, 500);
}
process.on("SIGINT", function () { return shutdown("SIGINT"); }); // ctrl+c
process.on("SIGTERM", function () { return shutdown("SIGTERM"); }); // kill command
// safety nets
process.on("unhandledRejection", function (reason) {
    console.error("❌ Unhandled promise rejection:", reason);
});
process.on("uncaughtException", function (err) {
    console.error("❌ Uncaught exception:", err.message);
});
main();
