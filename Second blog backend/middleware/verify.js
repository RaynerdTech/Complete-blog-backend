const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
  const { user_token } = req.cookies;
  console.log(user_token);
  if (!user_token) {
    return res.json({ message: "You are not logged in" });
  }
  
  jwt.verify(user_token, process.env.JWT_SECRET, (error, info) => {
    if (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.log(info);
    req.user = info;
    next();
  });
};

module.exports = { verify };
