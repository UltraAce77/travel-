const Trek = require("../models/Trek");
const Assignment = require("../models/Assignment");
const { assignmentOrder } = require("../utils/trekProgress");

async function createAssignmentSet(userId, size = 30) {
  const treks = await Trek.aggregate([
    { $match: { active: { $ne: false } } },
    { $sample: { size } },
  ]);
  if (!treks.length) return [];

  const created = await Assignment.insertMany(
    treks.map((trek) => ({
      userId,
      trekId: trek._id,
      price: trek.price,
      commission: trek.commission,
      archived: false,
    }))
  );

  return Assignment.find({ _id: { $in: created.map((item) => item._id) } })
    .sort(assignmentOrder)
    .populate("trekId");
}

async function hasActiveSet(userId) {
  return Assignment.exists({ userId, archived: { $ne: true }, status: "pending" });
}

async function archiveFinishedSet(userId) {
  return Assignment.updateMany(
    { userId, archived: { $ne: true }, status: "completed" },
    { $set: { archived: true } }
  );
}

module.exports = { createAssignmentSet, hasActiveSet, archiveFinishedSet };
