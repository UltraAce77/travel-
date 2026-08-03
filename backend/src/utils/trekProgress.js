const assignmentOrder = Object.freeze({ createdAt: 1, _id: 1 });

function completionCredit(commission, price = 0, currentBalance = 0) {
  const earned = Number(commission);
  const safeEarned = Number.isFinite(earned) && earned > 0 ? earned : 0;
  const ticketPrice = Number(price);
  const safePrice = Number.isFinite(ticketPrice) && ticketPrice > 0 ? ticketPrice : 0;
  const balance = Number(currentBalance);
  const safeBalance = Number.isFinite(balance) ? balance : 0;
  const negativeTicket = safePrice > safeBalance;
  const balanceChange = negativeTicket ? -safePrice : safeEarned;

  return {
    earned: safeEarned,
    negativeTicket,
    balanceChange,
    projectedBalance: safeBalance + balanceChange,
    update: {
      $inc: {
        "record.totalBalance": balanceChange,
        "record.commission": safeEarned,
        "record.completedTreks": 1,
      },
    },
  };
}

module.exports = { assignmentOrder, completionCredit };
