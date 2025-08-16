"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSitesTestResponseToConfigInput = convertSitesTestResponseToConfigInput;
function convertSitesTestResponseToConfigInput(responses, siteMetadata, timestamp) {
    var e_1, _a, e_2, _b, e_3, _c;
    var _d;
    if (timestamp === void 0) { timestamp = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tehran" })).toISOString(); }
    // Step 1: Build a map from domain to site metadata
    var metadataMap = new Map();
    try {
        for (var siteMetadata_1 = __values(siteMetadata), siteMetadata_1_1 = siteMetadata_1.next(); !siteMetadata_1_1.done; siteMetadata_1_1 = siteMetadata_1.next()) {
            var site = siteMetadata_1_1.value;
            metadataMap.set(new URL(site.domain).hostname, site);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (siteMetadata_1_1 && !siteMetadata_1_1.done && (_a = siteMetadata_1.return)) _a.call(siteMetadata_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // Step 2: Group slots by category + config_name
    var grouped = new Map();
    try {
        for (var responses_1 = __values(responses), responses_1_1 = responses_1.next(); !responses_1_1.done; responses_1_1 = responses_1.next()) {
            var res = responses_1_1.value;
            var hostname = new URL(res.url).hostname;
            var meta = metadataMap.get(hostname);
            if (!meta) {
                console.warn("No metadata found for domain: ".concat(hostname));
                continue;
            }
            var key = "".concat(res.category, "__").concat((_d = res.config_name) !== null && _d !== void 0 ? _d : "DEFAULT_CONFIG");
            var slot = {
                site_name: meta.name,
                up: 0 < Number((res.total + res.starttransfer) / 2) ? true : false,
                color: meta.color,
            };
            if (!grouped.has(key)) {
                grouped.set(key, []);
            }
            grouped.get(key).push(slot);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (responses_1_1 && !responses_1_1.done && (_b = responses_1.return)) _b.call(responses_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    // Step 3: Convert to ConfigInput[]
    var result = [];
    try {
        for (var _e = __values(grouped.entries()), _f = _e.next(); !_f.done; _f = _e.next()) {
            var _g = __read(_f.value, 2), key = _g[0], slots = _g[1];
            var _h = __read(key.split("__"), 2), category = _h[0], config_name = _h[1];
            result.push({
                category: category,
                config_name: config_name,
                charts: [
                    {
                        timestamp: timestamp,
                        slots: slots,
                    },
                ],
            });
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_c = _e.return)) _c.call(_e);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return result;
}
