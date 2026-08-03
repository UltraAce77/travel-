const ALLOWED_FUND_STATUSES = new Set(["approved", "rejected"]);

function normalizeFundAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

function isAllowedFundStatus(status) {
  return ALLOWED_FUND_STATUSES.has(status);
}

module.exports = { normalizeFundAmount, isAllowedFundStatus };
