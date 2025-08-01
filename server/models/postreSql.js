import { Pool } from "pg";
require("dotenv").config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ PostgreSQL connection failed:", err.stack);
  } else {
    console.log("✅ PostgreSQL connected successfully at", res.rows[0].now);
  }
});

export default pool;
