const User = require("../../models/User");
const Assignment = require("../../models/Assignment");
const Response = require("../../utils/response");
const { assignment } = require("../../utils/mongoResponse");
const { assignmentOrder, completionCredit } = require("../../utils/trekProgress");
const { createAssignmentSet, archiveFinishedSet } = require("../../services/assignmentSetService");

const initateTreks = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json(new Response(null, "User not found", 404, "error"));
    if (user.record.totalBalance < 100) {
      return res.status(400).json(new Response(null, "Insufficient balance. User needs at least $100.", 400, "error"));
    }

    const existing = await Assignment.find({ userId: user._id, archived: { $ne: true } })
      .sort(assignmentOrder)
      .populate("trekId");
    if (existing.some((item) => item.status === "pending")) {
      return res.json(new Response(existing.map(assignment), "Treks assigned successfully.", 200, "success"));
    }

    if (existing.length) await archiveFinishedSet(user._id);
    const items = await createAssignmentSet(user._id);
    if (!items.length) return res.status(409).json(new Response(null, "No treks are available", 409, "error"));
    return res.json(new Response(items.map(assignment), "Treks assigned successfully.", 200, "success"));
  } catch (error) {
    console.error("Error initiating treks:", error.message);
    return res.status(500).json(new Response(null, "Internal server error.", 500, "error"));
  }
};

const approveTrek = async (req, res) => {
  try {
    const { id, assignmentID } = req.body;
    const rating = Number(req.body.rating);
    const description = String(req.body.description || "").trim();
    if (!id || !assignmentID) {
      return res.status(400).json(new Response(null, "User and assignment are required", 400, "error"));
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json(new Response(null, "Choose a rating from 1 to 5 stars", 400, "error"));
    }
    if (description.length > 1000) {
      return res.status(400).json(new Response(null, "Description must be 1000 characters or fewer", 400, "error"));
    }

    const current = await Assignment.findOne({ userId: id, archived: { $ne: true }, status: "pending" }).sort(assignmentOrder);
    if (!current) return res.status(404).json(new Response(null, "No pending trek was found", 404, "error"));
    if (current._id.toString() !== String(assignmentID)) {
      return res.status(409).json(new Response(null, "Complete the current trek before continuing", 409, "error"));
    }

    const item = await Assignment.findOneAndUpdate(
      { _id: current._id, userId: id, archived: { $ne: true }, status: "pending" },
      { $set: { status: "completed", rating, description } },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(409).json(new Response(null, "This trek has already been completed", 409, "error"));

    const credit = completionCredit(item.commission);
    const user = await User.findByIdAndUpdate(id, credit.update, { new: true });
    if (!user) return res.status(404).json(new Response(null, "User not found", 404, "error"));

    const next = await Assignment.findOne({ userId: id, archived: { $ne: true }, status: "pending" })
      .sort(assignmentOrder)
      .populate("trekId");
    if (!next) {
      await User.findByIdAndUpdate(id, { $inc: { "record.completedTravel": 1 } });
      await Assignment.updateMany({ userId: id, archived: { $ne: true } }, { $set: { archived: true } });
    }

    return res.json(new Response({ balance: user.record.totalBalance, earned: credit.earned, next: next ? assignment(next) : null }, "Trek completed.", 200, "success"));
  } catch (error) {
    console.error("Error approving treks:", error.message);
    return res.status(500).json(new Response(null, "Error approving trek.", 500, "error"));
  }
};

module.exports = { initateTreks, approveTrek };
