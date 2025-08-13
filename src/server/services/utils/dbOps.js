"use strict";
// db.ts
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLast60ChartsGroupedByCategory = getLast60ChartsGroupedByCategory;
exports.addChartsWithSlotsBatch = addChartsWithSlotsBatch;
exports.setGroupedCharts = setGroupedCharts;
exports.getGroupedCharts = getGroupedCharts;
function getLast60ChartsGroupedByCategory(db) {
    var e_1, _a;
    // Get all configs
    var configs = db
        .prepare("SELECT id, category, config_name FROM configs")
        .all();
    var output = { finance: [], gaming: [], dev: [], social: [] };
    try {
        for (var configs_1 = __values(configs), configs_1_1 = configs_1.next(); !configs_1_1.done; configs_1_1 = configs_1.next()) {
            var config = configs_1_1.value;
            var charts = db
                .prepare("SELECT id, timestamp FROM charts\n         WHERE config_id = ?\n         ORDER BY timestamp DESC\n         LIMIT 60")
                .all(config.id);
            var chartData = charts.map(function (chart) {
                var slots = db
                    .prepare("SELECT site_name, up, color FROM slots WHERE chart_id = ?")
                    .all(chart.id)
                    .map(function (s) { return ({
                    site_name: s.site_name,
                    up: s.up == 1 ? true : false,
                    color: s.color,
                }); });
                return {
                    timestamp: chart.timestamp,
                    slots: slots,
                };
            });
            if (!output[config.category]) {
                output[config.category] = [];
            }
            output[config.category].push({
                config_name: config.config_name,
                chart: chartData,
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (configs_1_1 && !configs_1_1.done && (_a = configs_1.return)) _a.call(configs_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return output;
}
// addChartsWithSlotsBatch.ts
function addChartsWithSlotsBatch(data, db) {
    var insertConfig = db.prepare("\n    INSERT INTO configs (category, config_name)\n    VALUES (?, ?)\n    ON CONFLICT(category, config_name) DO NOTHING\n  ");
    var getConfigId = db.prepare("\n    SELECT id FROM configs WHERE category = ? AND config_name = ?\n  ");
    var insertChart = db.prepare("\n    INSERT INTO charts (config_id, timestamp) VALUES (?, ?)\n  ");
    var insertSlot = db.prepare("\n    INSERT INTO slots (chart_id, site_name, up, color)\n    VALUES (?, ?, ?, ?)\n  ");
    var runBatch = db.transaction(function (configs) {
        var e_2, _a, e_3, _b, e_4, _c;
        try {
            for (var configs_2 = __values(configs), configs_2_1 = configs_2.next(); !configs_2_1.done; configs_2_1 = configs_2.next()) {
                var _d = configs_2_1.value, category = _d.category, config_name = _d.config_name, charts = _d.charts;
                insertConfig.run(category, config_name);
                var config_id = getConfigId.get(category, config_name).id;
                try {
                    for (var charts_1 = (e_3 = void 0, __values(charts)), charts_1_1 = charts_1.next(); !charts_1_1.done; charts_1_1 = charts_1.next()) {
                        var _e = charts_1_1.value, timestamp = _e.timestamp, slots = _e.slots;
                        if (slots.length > 60)
                            throw new Error("More than 60 slots not allowed");
                        var chart_id = insertChart.run(config_id, timestamp).lastInsertRowid;
                        try {
                            for (var slots_1 = (e_4 = void 0, __values(slots)), slots_1_1 = slots_1.next(); !slots_1_1.done; slots_1_1 = slots_1.next()) {
                                var _f = slots_1_1.value, site_name = _f.site_name, up = _f.up, color = _f.color;
                                insertSlot.run(chart_id, site_name, up ? 1 : 0, color);
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (slots_1_1 && !slots_1_1.done && (_c = slots_1.return)) _c.call(slots_1);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (charts_1_1 && !charts_1_1.done && (_b = charts_1.return)) _b.call(charts_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (configs_2_1 && !configs_2_1.done && (_a = configs_2.return)) _a.call(configs_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
    runBatch(data);
}
function setGroupedCharts(db, items) {
    // Clear old data
    db.prepare("DELETE FROM sites_test_responses").run();
    var insert = db.prepare("\n    INSERT INTO sites_test_responses (\n      namelookup, connect, starttransfer, total,\n      url, config_name, config_raw, country, ip, category\n    )\n    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n  ");
    var insertMany = db.transaction(function (responses) {
        var e_5, _a;
        var _b, _c, _d;
        try {
            for (var responses_1 = __values(responses), responses_1_1 = responses_1.next(); !responses_1_1.done; responses_1_1 = responses_1.next()) {
                var r = responses_1_1.value;
                insert.run(r.namelookup, r.connect, r.starttransfer, r.total, r.url, (_b = r.config_name) !== null && _b !== void 0 ? _b : null, (_c = r.config_raw) !== null && _c !== void 0 ? _c : null, (_d = r.country) !== null && _d !== void 0 ? _d : null, r.ip, r.category);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (responses_1_1 && !responses_1_1.done && (_a = responses_1.return)) _a.call(responses_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
    });
    insertMany(items);
}
function getGroupedCharts(db) {
    return db.prepare("SELECT * FROM sites_test_responses").all();
}
