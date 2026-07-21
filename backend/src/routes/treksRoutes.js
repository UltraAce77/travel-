const express = require("express");
const router = express.Router();

const treks = require("../controller/treks/treksController");
const userTreks = require("../controller/treks/userTreksController");
const recordTreks = require("../controller/treks/recordController");
const auth = require("../controller/auth/authController");

const ownAccount = (req, res, next) => {
  const id = req.params.id || req.body.id;
  if (req.user?.role !== "user" || req.user.id !== id) {
    return res.status(403).json({ data: null, message: "You can only manage your own treks", status: 403, type: "error" });
  }
  return next();
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ data: null, message: "Administrator access is required", status: 403, type: "error" });
  }
  return next();
};

router.post("/upload", auth.verifyToken, adminOnly, treks.upload, treks.uploadProduct);
router.get("/getTreks", treks.getTreks);
router.delete("/delete/:trekID", auth.verifyToken, adminOnly, treks.deleteTrek);

router.get("/initiate/:id", auth.verifyToken, ownAccount, userTreks.initateTreks);
router.post("/approveTrek", auth.verifyToken, ownAccount, userTreks.approveTrek);

router.post("/assign/:id", auth.verifyToken, adminOnly, recordTreks.assignNewTreks);
router.get("/records/:id", auth.verifyToken, adminOnly, recordTreks.getRecords);
router.put("/updatePrice", auth.verifyToken, adminOnly, recordTreks.updatePrice);

module.exports = router;
