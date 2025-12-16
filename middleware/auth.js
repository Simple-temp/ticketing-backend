// const jwt = require("jsonwebtoken");

// const auth = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "Unauthorized" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // add user to request
//     next();
//   } catch (e) {
//     return res.status(401).json({ message: "Invalid Token" });
//   }
// };

// module.exports = auth;


const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema.js");

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 FETCH USER NAME
    const user = await User.findById(decoded.id).select("name");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Attach BOTH id & name
    req.user = {
      id: user._id,
      name: user.name,
    };

    next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = auth;


