const express = require("express");
const router = express.Router();

const treks = require("../controller/treks/treksController");
const userTreks = require("../controller/treks/userTreksController");
const recordTreks = require("../controller/treks/recordController");

// Admin Treks CURD
router.post("/upload", treks.upload, treks.uploadProduct);
router.get("/getTreks", treks.getTreks);
router.delete("/delete/:trekID", treks.deleteTrek);

//  User Treks

router.get("/initiate/:id", userTreks.initateTreks);
router.post("/approveTrek", userTreks.approveTrek);

// admin Treks transactions

router.get("/records/:id", recordTreks.getRecords);
router.put("/updatePrice", recordTreks.updatePrice);

module.exports = router;
