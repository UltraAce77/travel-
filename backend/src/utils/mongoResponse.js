function userRecord(user) {
   const record = user.record || {};
   return { recordID: user._id.toString(), userID: user._id.toString(), managerID: user.referredBy?._id?.toString?.() || user.referredBy?.toString?.() || null, totalBalance: record.totalBalance || 0, completedTreks: record.completedTreks || 0, completedTravel: record.completedTravel || 0, commission: record.commission || 0, cryptoAddress: record.cryptoAddress || null };
}
function publicUser(user, includeRecord = false) {
   const result = { id: user._id.toString(), userName: user.userName, email: user.email, role: user.role, referralCode: user.referralCode, withdrawCode: user.withdrawCode, referredBy: user.referredBy?._id?.toString?.() || user.referredBy?.toString?.() || null };
   return includeRecord ? { ...result, ...userRecord(user) } : result;
}
function trek(t) { return { trekID: t._id.toString(), title: t.title, price: t.price, commission: t.commission, picture: t.picture ? t.picture.toString("base64") : null }; }
function assignment(a) { const t=a.trekId; return { assignmentID: a._id.toString(), trekID: t?._id?.toString?.() || t?.toString?.(), price: a.price, commission: a.commission, status: a.status, title: t?.title, picture: t?.picture ? t.picture.toString("base64") : null }; }
module.exports={ userRecord, publicUser, trek, assignment };