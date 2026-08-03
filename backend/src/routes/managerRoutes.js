const express = require("express");
const router = express.Router();

const manager = require("../controller/manager/managerController");
const auth = require("../controller/auth/authController");
const { allowRoles } = require("../middleware/authorization");

router.get("/fetch", auth.verifyToken, allowRoles("admin", "manager"), manager.fetch);

module.exports = router;
