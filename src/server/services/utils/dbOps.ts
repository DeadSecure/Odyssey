// db.ts
import path from "path";
import Database from "better-sqlite3";
import { ConfigInput } from "@/server/models/client/db";
import { statusBar } from "@/server/models/client/bars";
import { Categories, SitesTestResponse } from "@/server/models/interfaces";

// addChartWithSlots.ts

type Slot = { site_name: string; up: number; color: string };

export function getLast60ChartsGroupedByCategory(db: any): statusBar {
  // Get all configs
  const configs = db
    .prepare(`SELECT id, category, config_name FROM configs`)
    .all();

  const output: statusBar = { finance: [], gaming: [], dev: [], social: [] };

  for (const config of configs) {
    const charts = db
      .prepare(
        `SELECT id, timestamp FROM charts
         WHERE config_id = ?
         ORDER BY timestamp DESC
         LIMIT 60`
      )
      .all(config.id);

    const chartData = charts.map((chart: any) => {
      const slots = db
        .prepare(`SELECT site_name, up, color FROM slots WHERE chart_id = ?`)
        .all(chart.id)
        .map((s: any) => ({
          site_name: s.site_name,
          up: s.up == 1 ? true : false,
          color: s.color,
        }));

      return {
        timestamp: chart.timestamp,
        slots,
      };
    });

    if (!output[config.category as Categories]) {
      output[config.category as Categories] = [];
    }

    output[config.category as Categories].push({
      config_name: config.config_name,
      chart: chartData,
    });
  }

  return output;
}

// addChartsWithSlotsBatch.ts

export function addChartsWithSlotsBatch(data: ConfigInput[], db: any) {
  const insertConfig = db.prepare(`
    INSERT INTO configs (category, config_name)
    VALUES (?, ?)
    ON CONFLICT(category, config_name) DO NOTHING
  `);

  const getConfigId = db.prepare(`
    SELECT id FROM configs WHERE category = ? AND config_name = ?
  `);

  const insertChart = db.prepare(`
    INSERT INTO charts (config_id, timestamp) VALUES (?, ?)
  `);

  const insertSlot = db.prepare(`
    INSERT INTO slots (chart_id, site_name, up, color)
    VALUES (?, ?, ?, ?)
  `);

  const runBatch = db.transaction((configs: ConfigInput[]) => {
    for (const { category, config_name, charts } of configs) {
      insertConfig.run(category, config_name);
      const { id: config_id } = getConfigId.get(category, config_name) as any;

      for (const { timestamp, slots } of charts) {
        if (slots.length > 60)
          throw new Error("More than 60 slots not allowed");
        const { lastInsertRowid: chart_id } = insertChart.run(
          config_id,
          timestamp
        );

        for (const { site_name, up, color } of slots) {
          insertSlot.run(chart_id, site_name, up ? 1 : 0, color);
        }
      }
    }
  });

  runBatch(data);
}

// export function setGroupedCharts(db: any, items: SitesTestResponse[]) {
//   // Clear old data
//   db.prepare(`DELETE FROM sites_test_responses`).run();

//   const insert = db.prepare(`
//     INSERT INTO sites_test_responses (
//       namelookup, connect, starttransfer, total,
//       url, config_name, config_raw, country, ip, category
//     )
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `);

//   const insertMany = db.transaction((responses: SitesTestResponse[]) => {
//     for (const r of responses) {
//       insert.run(
//         r.namelookup,
//         r.connect,
//         r.starttransfer,
//         r.total,
//         r.url,
//         r.config_name ?? null,
//         r.config_raw ?? null,
//         r.country ?? null,
//         r.ip,
//         r.category
//       );
//     }
//   });

//   insertMany(items);
// }

export function getGroupedCharts(db: any): SitesTestResponse[] {
  return db.prepare(`SELECT * FROM sites_test_responses`).all();
}
