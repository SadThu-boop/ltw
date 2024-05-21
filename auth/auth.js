const jwt = require("jsonwebtoken");

module.exports.requiredAuth = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const secretKey = "minhdh";

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Không có mã thông báo",
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("Lỗi xác thực:", err);
      return res.status(403).json({
        success: false,
        message: "Mã thông báo không hợp lệ hoặc đã hết hạn",
      });
    }

    console.log("Mã thông báo đã giải mã:", decoded);
    return res.status(200).json({
      success: true,
      message: "Xác thực thành công",
      userId: decoded.userId,
    });
  });
};
