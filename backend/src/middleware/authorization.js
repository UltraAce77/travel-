const Response = require("../utils/response");

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json(new Response(null, "You do not have permission to perform this action", 403, "error"));
    }
    return next();
  };
}

function allowSelfOrRoles(getTargetId, ...roles) {
  return (req, res, next) => {
    const targetId = String(getTargetId(req) || "");
    const isAllowedRole = req.user && roles.includes(req.user.role);
    const isOwnUser = req.user?.role === "user" && String(req.user.id) === targetId;
    if (!isAllowedRole && !isOwnUser) {
      return res.status(403).json(new Response(null, "You can only manage your own account", 403, "error"));
    }
    return next();
  };
}

module.exports = { allowRoles, allowSelfOrRoles };
