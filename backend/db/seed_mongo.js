require("dotenv").config();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { connectDatabase, closeDatabase } = require("../src/config/database");
const User = require("../src/models/User");
const Trek = require("../src/models/Trek");

async function seed() {
   if (process.env.NODE_ENV === "production" && process.env.ALLOW_PRODUCTION_SEED !== "true") throw new Error("Production seeding is disabled");
   await connectDatabase();
   const sql = fs.readFileSync(path.join(__dirname, "seed_treks.sql"), "utf8");
   const trekRows = [...sql.matchAll(/\('((?:[^']|'')+)',\s*([\d.]+),\s*([\d.]+)\)/g)].map((m) => ({ title: m[1].replace(/''/g, "'"), price: Number(m[2]), commission: Number(m[3]) }));
   if (await Trek.countDocuments() === 0 && trekRows.length) await Trek.insertMany(trekRows);
   const demo = [
      { userName:"Admin", email:"admin@gmail.com", password:"admin123", role:"admin", referralCode:"ADMIN100", withdrawCode:"WD-ADMIN" },
      { userName:"Manager", email:"manager@gmail.com", password:"manager123", role:"manager", referralCode:"MANAGER100", withdrawCode:"WD-MGR", referredByCode:"ADMIN100" },
      { userName:"DemoUser", email:"user@gmail.com", password:"user123", role:"user", withdrawCode:"WD-USER", referredByCode:"MANAGER100", record:{totalBalance:150} },
   ];
   const byCode = {};
   for (const item of demo) {
      if (await User.exists({ email:item.email })) continue;
      const user = await User.create({ ...item, password:await bcrypt.hash(item.password,10), referredBy:item.referredByCode?byCode[item.referredByCode]:null });
      if (item.referralCode) byCode[item.referralCode]=user._id;
   }
   console.log(`MongoDB seed complete: ${await User.countDocuments()} users, ${await Trek.countDocuments()} treks`);
}
seed().catch((e)=>{console.error("Seed failed:",e.message);process.exitCode=1;}).finally(closeDatabase);