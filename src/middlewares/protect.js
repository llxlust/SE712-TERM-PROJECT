const jwt = require("jsonwebtoken");

async function Protect(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.json({
      data: "Forbidden Request",
      success: false,
      timestamp: Date.now(),
    });
  }
  const payload = await jwt.decode(token, "secret");
  const uuid = payload.uuid;
  if (!uuid) {
    return res.json({
      data: "Forbidden Request",
      success: false,
      timestamp: Date.now(),
    });
  }
  next();
}

module.exports = Protect;
