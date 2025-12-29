import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function initializeDatabase() {
  let connection: mysql.Connection | null = null;

  try {
    // First, create connection without database to create it if it doesn't exist
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
    });

    console.log("✓ Connected to MySQL server");

    // Create database if not exists
    const dbName = process.env.DB_NAME || "restaurant_db";
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✓ Database '${dbName}' ready`);

    // Switch to the database
    await connection.changeUser({ database: dbName });

    // Read SQL file
    const sqlFile = path.join(process.cwd(), "database.sql");
    const sql = fs.readFileSync(sqlFile, "utf8");

    // Split SQL into individual statements and execute
    const statements = sql
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

    for (const statement of statements) {
      try {
        await connection.query(statement);
        console.log("✓ Executed:", statement.substring(0, 60) + "...");
      } catch (err: any) {
        console.error("Error executing statement:", statement.substring(0, 60));
        console.error(err.message);
      }
    }

    await connection.end();
    console.log("\n✅ MySQL database initialized successfully!");
  } catch (error: any) {
    console.error("❌ Error initializing database:", error.message);
    console.error("Full error:", error);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

initializeDatabase();
