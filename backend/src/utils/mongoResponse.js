function userRecord(user) {
  const record = user.record || {};
  return {
    recordID: user._id.toString(),
    userID: user._id.toString(),
    managerID: user.referredBy?._id?.toString?.() || user.referredBy?.toString?.() || null,
    totalBalance: record.totalBalance || 0,
    completedTreks: record.completedTreks || 0,
    completedTravel: record.completedTravel || 0,
    commission: record.commission || 0,
    cryptoAddress: record.cryptoAddress || null,
  };
}

function publicUser(user, includeRecord = false) {
  const result = {
    id: user._id.toString(),
    userName: user.userName,
    email: user.email,
    role: user.role,
    referralCode: user.referralCode,
    withdrawCode: user.withdrawCode,
    referredBy: user.referredBy?._id?.toString?.() || user.referredBy?.toString?.() || null,
  };
  return includeRecord ? { ...result, ...userRecord(user) } : result;
}

function trek(item) {
  return {
    trekID: item._id.toString(),
    title: item.title,
    price: item.price,
    commission: item.commission,
    picture: item.picture ? item.picture.toString("base64") : null,
    imageUrl: item.imageUrl || null,
    imageSource: item.imageSource || null,
  };
}

function assignment(item) {
  const trekItem = item.trekId;
  return {
    assignmentID: item._id.toString(),
    trekID: trekItem?._id?.toString?.() || trekItem?.toString?.(),
    price: item.price,
    commission: item.commission,
    status: item.status,
    rating: item.rating || null,
    description: item.description || "",
    archived: Boolean(item.archived),
    title: trekItem?.title,
    picture: trekItem?.picture ? trekItem.picture.toString("base64") : null,
    imageUrl: trekItem?.imageUrl || null,
    imageSource: trekItem?.imageSource || null,
  };
}

module.exports = { userRecord, publicUser, trek, assignment };
