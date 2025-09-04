import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "No token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const isOffice = (req, res, next) => {
  if (req.user?.role !== "office" && req.user?.role !== "admin")
    return res.status(403).json({ message: "Office only" });
  next();
};
