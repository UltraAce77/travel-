const express = require("express");
const router = express.Router();

const manager = require("../controller/manager/managerController");

router.get("/fetch", manager.fetch);

module.exports = router;
