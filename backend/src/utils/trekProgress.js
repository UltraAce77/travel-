const assignmentOrder = Object.freeze({ createdAt: 1, _id: 1 });

function completionCredit(commission) {
  const earned = Number(commission);
  const safeEarned = Number.isFinite(earned) && earned > 0 ? earned : 0;
  return {
    earned: safeEarned,
    update: {
      $inc: {
        "record.totalBalance": safeEarned,
        "record.commission": safeEarned,
        "record.completedTreks": 1,
      },
    },
  };
}

module.exports = { assignmentOrder, completionCredit };
