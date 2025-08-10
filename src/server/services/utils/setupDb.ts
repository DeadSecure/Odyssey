import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

export async function setupDb(user_path: string) {
  const dbPath = path.join(user_path, "db.sqlite");
  console.log(dbPath);
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, "");
    console.log("✅ Created data directory");
  }

  const db = new Database(dbPath);

  // configs table: holds category + config_name
  db.exec(`
    CREATE TABLE IF NOT EXISTS configs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,        -- e.g., 'finance', 'military'
      config_name TEXT NOT NULL,     -- e.g., 'GERMANY TUNNEL'
      UNIQUE(category, config_name)
    );
  `);

  // charts table: one row per timestamp for a config
  db.exec(`
    CREATE TABLE IF NOT EXISTS charts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      config_id INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (config_id) REFERENCES configs(id) ON DELETE CASCADE
    );
  `);

  // slots table: each entry per chart, up to 60 rows enforced in code
  db.exec(`
    CREATE TABLE IF NOT EXISTS slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      chart_id INTEGER NOT NULL,
      site_name TEXT NOT NULL,
      up INTEGER NOT NULL CHECK (up IN (0, 1)), -- true/false
      color TEXT NOT NULL,
      FOREIGN KEY (chart_id) REFERENCES charts(id) ON DELETE CASCADE
    );
  `);

// sites_test_responses table: stores raw site test results
db.exec(`
  CREATE TABLE IF NOT EXISTS sites_test_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    namelookup REAL NOT NULL,
    connect REAL NOT NULL,
    starttransfer REAL NOT NULL,
    total REAL NOT NULL,
    url TEXT NOT NULL,
    config_name TEXT,
    config_raw TEXT,
    country TEXT,
    ip TEXT NOT NULL,
    category TEXT NOT NULL
  );
`);


  console.log(`✅ Multi-category status bar DB created at: ${dbPath}`);
}
