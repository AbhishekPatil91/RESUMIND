import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  googleId: { type: String },
  avatar: { type: String },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  resumeCount: { type: Number, default: 0 },
  aiUsageCount: { type: Number, default: 0 },
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpiry;
  return user;
};

export default mongoose.model('User', userSchema);
