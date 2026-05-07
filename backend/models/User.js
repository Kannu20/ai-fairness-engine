const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["developer", "auditor", "policymaker"], default: "developer" },
    organization: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date, default: Date.now },
    modelsAudited: { type: Number, default: 0 },
    plan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
