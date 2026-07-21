const User = require("../../models/User");
const Assignment = require("../../models/Assignment");
const Response = require("../../utils/response");
const { assignment } = require("../../utils/mongoResponse");
const { assignmentOrder } = require("../../utils/trekProgress");
const { createAssignmentSet, hasActiveSet, archiveFinishedSet } = require("../../services/assignmentSetService");

const getRecords = async (req, res) => {
  try {
    const items = await Assignment.find({ userId: req.params.id })
      .sort(assignmentOrder)
      .populate("trekId");
    if (!items.length) return res.json(new Response([], "Treks are not assigned.", 200, "success"));
    return res.json(new Response(items.map(assignment), "Treks fetched successfully.", 200, "success"));
  } catch (error) {
    console.error("Error in user trek records:", error.message);
    return res.status(500).json(new Response(null, "Error in user trek records.", 500, "error"));
  }
};

const updatePrice = async (req, res) => {
  try {
    const { id, assignmentID, price, commission } = req.body;
    const item = await Assignment.findOneAndUpdate(
      { _id: assignmentID, userId: id, archived: { $ne: true }, status: "pending" },
      { $set: { price: Number(price), commission: Number(commission) } },
      { runValidators: true }
    );
    if (!item) return res.status(404).json(new Response(null, "Pending assignment not found", 404, "error"));
    return res.json(new Response(null, "Trek updated successfully.", 200, "success"));
  } catch (error) {
    console.error("Error in trek price update:", error.message);
    return res.status(500).json(new Response(null, "Error in trek price update.", 500, "error"));
  }
};

const assignNewTreks = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: "user", active: true });
    if (!user) return res.status(404).json(new Response(null, "User not found", 404, "error"));
    if (await hasActiveSet(user._id)) {
      return res.status(409).json(new Response(null, "This user already has an active trek set", 409, "error"));
    }

    await archiveFinishedSet(user._id);
    const items = await createAssignmentSet(user._id);
    if (!items.length) return res.status(409).json(new Response(null, "No treks are available", 409, "error"));
    return res.status(201).json(new Response({ assigned: items.length }, `${items.length} new treks assigned`, 201, "success"));
  } catch (error) {
    console.error("Error assigning treks:", error.message);
    return res.status(500).json(new Response(null, "Error assigning new treks", 500, "error"));
  }
};

module.exports = { getRecords, updatePrice, assignNewTreks };
