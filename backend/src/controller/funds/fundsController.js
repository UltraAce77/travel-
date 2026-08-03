const mongoose = require("mongoose");
const Fund = require("../../models/Fund");
const User = require("../../models/User");
const Response = require("../../utils/response");
const { normalizeFundAmount, isAllowedFundStatus } = require("../../utils/fundRules");

const addFunds = async (req, res) => {
  try {
    const userID = String(req.body.userID || "");
    const amount = normalizeFundAmount(req.body.amount);
    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json(new Response(null, "A valid user is required", 400, "error"));
    }
    if (amount === null) {
      return res.status(400).json(new Response(null, "Amount must be greater than zero", 400, "error"));
    }
    if (req.user?.role === "user" && amount < 10) {
      return res.status(400).json(new Response(null, "Deposit request must be $10 or more", 400, "error"));
    }

    const user = await User.exists({ _id: userID, role: "user", active: true });
    if (!user) return res.status(404).json(new Response(null, "User not found", 404, "error"));

    const fund = await Fund.create({ userId: userID, balance: amount });
    return res.status(201).json(
      new Response(
        { fundID: fund._id.toString(), amount: fund.balance, status: fund.status },
        "Deposit request submitted successfully",
        201,
        "success"
      )
    );
  } catch (error) {
    console.error("Error adding funds:", error.message);
    return res.status(500).json(new Response(null, "Internal Server Error", 500, "error"));
  }
};

const getAllFunds = async (_req, res) => {
  try {
    const funds = await Fund.find().populate("userId", "userName email").sort({ createdAt: -1 });
    const rows = funds.map((fund) => ({
      userName: fund.userId?.userName,
      email: fund.userId?.email,
      fundID: fund._id.toString(),
      balance: fund.balance,
      status: fund.status,
      created_at: fund.createdAt.toLocaleDateString("en-GB").replaceAll("/", "-"),
    }));
    return res.json(new Response(rows, rows.length ? "Deposits fetched successfully" : "No deposits found", 200, "success"));
  } catch (error) {
    console.error("Error fetching funds:", error.message);
    return res.status(500).json(new Response(null, "Internal Server Error", 500, "error"));
  }
};

const updateFundStatus = async (req, res) => {
  try {
    const fundID = String(req.params.fundID || "");
    const status = String(req.body.status || "").toLowerCase();
    if (!mongoose.isValidObjectId(fundID)) {
      return res.status(400).json(new Response(null, "A valid deposit is required", 400, "error"));
    }
    if (!isAllowedFundStatus(status)) {
      return res.status(400).json(new Response(null, "Status must be approved or rejected", 400, "error"));
    }

    const fund = await Fund.findOneAndUpdate(
      { _id: fundID, status: "pending" },
      { $set: { status } },
      { new: true, runValidators: true }
    );
    if (!fund) {
      const existing = await Fund.exists({ _id: fundID });
      const message = existing ? "This deposit has already been processed" : "Deposit record not found";
      const statusCode = existing ? 409 : 404;
      return res.status(statusCode).json(new Response(null, message, statusCode, "error"));
    }

    let user = null;
    if (status === "approved") {
      try {
        user = await User.findByIdAndUpdate(
          fund.userId,
          { $inc: { "record.totalBalance": fund.balance } },
          { new: true }
        );
      } catch (error) {
        await Fund.updateOne({ _id: fund._id, status: "approved" }, { $set: { status: "pending" } });
        throw error;
      }
      if (!user) {
        await Fund.updateOne({ _id: fund._id, status: "approved" }, { $set: { status: "pending" } });
        return res.status(404).json(new Response(null, "User not found", 404, "error"));
      }
    }

    return res.json(
      new Response(
        { fundID: fund._id.toString(), status: fund.status, balance: user?.record?.totalBalance },
        status === "approved" ? "Deposit approved and balance credited" : "Deposit rejected",
        200,
        "success"
      )
    );
  } catch (error) {
    console.error("Error updating fund status:", error.message);
    return res.status(500).json(new Response(null, "Internal Server Error", 500, "error"));
  }
};

module.exports = { getAllFunds, updateFundStatus, addFunds };
