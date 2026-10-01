import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    codeHash: { type: String },
    attempts: { type: Number, default: 0 },
    resetTokenHash: { type: String },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordReset = mongoose.model("PasswordReset", passwordResetSchema);
export default PasswordReset;