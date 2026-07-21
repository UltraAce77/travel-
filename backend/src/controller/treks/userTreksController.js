const User = require("../../models/User");
const Trek = require("../../models/Trek");
const Assignment = require("../../models/Assignment");
const Response = require("../../utils/response");
const { assignment } = require("../../utils/mongoResponse");
const { assignmentOrder, completionCredit } = require("../../utils/trekProgress");

const initateTreks = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json(new Response(null, "User not found", 404, "error"));
    if (user.record.totalBalance < 100) {
      return res.status(400).json(new Response(null, "Insufficient balance. User needs at least $100.", 400, "error"));
    }

    const existing = await Assignment.find({ userId: user._id }).sort(assignmentOrder).populate("trekId");
    if (existing.some((item) => item.status === "pending")) {
      return res.json(new Response(existing.map(assignment), "Treks assigned successfully.", 200, "success"));
    }
    if (existing.length) await Assignment.deleteMany({ userId: user._id });

    const treks = await Trek.aggregate([{ $sample: { size: 30 } }]);
    if (!treks.length) return res.status(409).json(new Response(null, "No treks are available", 409, "error"));

    const created = await Assignment.insertMany(
      treks.map((trek) => ({
        userId: user._id,
        trekId: trek._id,
        price: trek.price,
        commission: trek.commission,
      }))
    );
    const items = await Assignment.find({ _id: { $in: created.map((item) => item._id) } })
      .sort(assignmentOrder)
      .populate("trekId");
    return res.json(new Response(items.map(assignment), "Treks assigned successfully.", 200, "success"));
  } catch (error) {
    console.error("Error initiating treks:", error.message);
    return res.status(500).json(new Response(null, "Internal server error.", 500, "error"));
  }
};

const approveTrek = async (req, res) => {
  try {
    const { id, assignmentID } = req.body;
    if (!id || !assignmentID) {
      return res.status(400).json(new Response(null, "User and assignment are required", 400, "error"));
    }

    const current = await Assignment.findOne({ userId: id, status: "pending" }).sort(assignmentOrder);
    if (!current) return res.status(404).json(new Response(null, "No pending trek was found", 404, "error"));
    if (current._id.toString() !== String(assignmentID)) {
      return res.status(409).json(new Response(null, "Complete the current trek before continuing", 409, "error"));
    }

    const item = await Assignment.findOneAndUpdate(
      { _id: current._id, userId: id, status: "pending" },
      { $set: { status: "completed" } },
      { new: true }
    );
    if (!item) return res.status(409).json(new Response(null, "This trek has already been completed", 409, "error"));

    const credit = completionCredit(item.commission);
    const user = await User.findByIdAndUpdate(id, credit.update, { new: true });
    if (!user) return res.status(404).json(new Response(null, "User not found", 404, "error"));

    const next = await Assignment.findOne({ userId: id, status: "pending" })
      .sort(assignmentOrder)
      .populate("trekId");
    if (!next) {
      await User.findByIdAndUpdate(id, { $inc: { "record.completedTravel": 1 } });
      await Assignment.deleteMany({ userId: id });
    }

    return res.json(new Response({ balance: user.record.totalBalance, earned: credit.earned, next: next ? assignment(next) : null }, "Trek completed.", 200, "success"));
  } catch (error) {
    console.error("Error approving treks:", error.message);
    return res.status(500).json(new Response(null, "Error approving trek.", 500, "error"));
  }
};

module.exports = { initateTreks, approveTrek };
