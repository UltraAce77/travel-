require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { connectDatabase, closeDatabase } = require("../src/config/database");
const Trek = require("../src/models/Trek");

async function seedTreks() {
   if (process.env.NODE_ENV === "production" && process.env.ALLOW_PRODUCTION_SEED !== "true") throw new Error("Production seeding is disabled");
   await connectDatabase();
   const sql = fs.readFileSync(path.join(__dirname, "seed_treks.sql"), "utf8");
   const rows = [...sql.matchAll(/\('((?:[^']|'')+)',\s*([\d.]+),\s*([\d.]+)\)/g)].map((match) => ({ title: match[1].replace(/''/g, "'"), price: Number(match[2]), commission: Number(match[3]) }));
   if (await Trek.countDocuments() === 0 && rows.length) await Trek.insertMany(rows);
   console.log(`Trek initialization complete: ${await Trek.countDocuments()} treks`);
}

seedTreks().catch((error) => { console.error("Trek initialization failed:", error.message); process.exitCode = 1; }).finally(closeDatabase);