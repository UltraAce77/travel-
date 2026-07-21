require("dotenv").config();
const { connectDatabase, closeDatabase } = require("../src/config/database");
const { syncTrekCatalog } = require("../src/services/trekCatalogService");

async function seedTreks() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_PRODUCTION_SEED !== "true") {
    throw new Error("Production seeding is disabled");
  }
  await connectDatabase();
  const result = await syncTrekCatalog();
  console.log(`Trek initialization complete: ${result.total} catalog treks`);
}

seedTreks()
  .catch((error) => {
    console.error("Trek initialization failed:", error.message);
    process.exitCode = 1;
  })
  .finally(closeDatabase);
