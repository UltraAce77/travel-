const Trek = require("../models/Trek");
const catalog = require("../../db/trekCatalog");

async function syncTrekCatalog() {
  if (!Array.isArray(catalog) || catalog.length !== 100) {
    throw new Error(`Expected a 100-item trek catalog, received ${catalog?.length || 0}`);
  }

  const operations = catalog.map((item) => ({
    updateOne: {
      filter: { title: item.title },
      update: {
        $set: {
          imageUrl: item.imageUrl,
          imageSource: item.imageSource,
          picture: null,
          catalogManaged: true,
        },
        $setOnInsert: {
          price: item.price,
          commission: item.commission,
          active: true,
        },
      },
      upsert: true,
    },
  }));

  const result = await Trek.bulkWrite(operations, { ordered: false });
  console.log(`Trek catalog synced: ${catalog.length} locations (${result.upsertedCount || 0} added).`);
  return { total: catalog.length, added: result.upsertedCount || 0 };
}

module.exports = { syncTrekCatalog };
