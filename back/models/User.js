const mongoose = require('mongoose');
const jwt       = require('jsonwebtoken');

const MonthlyStatSchema = new mongoose.Schema(
  {
    month      : { type: String, required: true },     // 'YYYY-MM'
    totalPlus  : { type: Number, default: 0 },         // gCO₂ ↓
    totalMinus : { type: Number, default: 0 },         // gCO₂ ↑
  },
  { _id: false },
);

const UserSchema = new mongoose.Schema(
  {
    email     : { type: String, required: true, unique: true },
    userId    : { type: String, required: true, unique: true },
    password  : { type: String, required: true },
    username  : { type: String, required: true, unique: true },
    userImage : String,
    role      : { type: String, enum: ['guardian', 'patient'], default: 'guardian' },

    /* 누적·캐시 필드 */
    monthlyCarbonStat : MonthlyStatSchema,
    carbonSaved_g     : { type: Number, default: 0 },   // 총 절감량 (g)
    bearTemp          : { type: Number, default: 75 },  // 0~100 → 낮을수록 ‘시원’
  },
  { timestamps: true },
);

/* ───────── 유틸 ───────── */
UserSchema.methods.createAccessToken = function () {
  return jwt.sign({ userId: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};
UserSchema.methods.createRefreshToken = function () {
  return jwt.sign({ userId: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

module.exports = mongoose.model('User', UserSchema);
