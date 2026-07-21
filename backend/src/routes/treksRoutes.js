const express = require("express");
const router = express.Router();

const treks = require("../controller/treks/treksController");
const userTreks = require("../controller/treks/userTreksController");
const recordTreks = require("../controller/treks/recordController");
const auth = require("../controller/auth/authController");
const ownAccount=(req,res,next)=>{const id=req.params.id||req.body.id;if(req.user?.role!=="user"||req.user.id!==id)return res.status(403).json({data:null,message:"You can only manage your own treks",status:403,type:"error"});next();};

// Admin Treks CURD
router.post("/upload", treks.upload, treks.uploadProduct);
router.get("/getTreks", treks.getTreks);
router.delete("/delete/:trekID", treks.deleteTrek);

//  User Treks

router.get("/initiate/:id", auth.verifyToken, ownAccount, userTreks.initateTreks);
router.post("/approveTrek", auth.verifyToken, ownAccount, userTreks.approveTrek);

// admin Treks transactions

router.get("/records/:id", recordTreks.getRecords);
router.put("/updatePrice", recordTreks.updatePrice);

module.exports = router;
