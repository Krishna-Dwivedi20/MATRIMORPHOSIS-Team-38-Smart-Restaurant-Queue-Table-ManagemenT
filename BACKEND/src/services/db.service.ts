import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "restaurant.db");
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Export a wrapper to make it compatible with mysql2/promise interface
export const dbQuery = (sql: string, params: any[] = []) => {
  try {
    const stmt = db.prepare(sql);
    if (sql.trim().toUpperCase().startsWith("SELECT")) {
      return [stmt.all(...params)];
    } else {
      const result = stmt.run(...params);
      return [{ insertId: result.lastInsertRowid, affectedRows: result.changes }];
    }
  } catch (error) {
    throw error;
  }
};
