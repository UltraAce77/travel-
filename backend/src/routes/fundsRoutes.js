const express = require("express");
const router = express.Router();

const funds = require("../controller/funds/fundsController");

router.post("/add", funds.addFunds);
router.get("/fetch", funds.getAllFunds);
router.put("/update/:fundID", funds.updateFundStatus);

module.exports = router;
