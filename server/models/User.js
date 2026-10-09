import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 70,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    institution: {
      type: String,
      trim: true,
      default: 'General Commuter',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'verified', 'demo_verified', 'institution_verified'],
      default: 'unverified',
    },
    isDriver: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: 300,
    },
    vehicle: {
      make: { type: String, default: '' },
      model: { type: String, default: '' },
      color: { type: String, default: '' },
      plateNumber: { type: String, default: '' },
      licensePlate: { type: String, default: '' },
      capacity: { type: Number, default: 4 },
    },
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relation: { type: String, default: '' },
      relationship: { type: String, default: '' },
    },
    preferences: {
      smokeFree: { type: Boolean, default: true },
      petsAllowed: { type: Boolean, default: false },
      ac: { type: Boolean, default: true },
      music: { type: Boolean, default: true },
      womenOnly: { type: Boolean, default: false },
    },
    rating: {
      average: { type: Number, default: 5.0, min: 1, max: 5 },
      count: { type: Number, default: 1 },
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify password
userSchema.methods.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Static helper to hash password
userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Return safe user representation without sensitive fields
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  if (typeof obj.institution === 'string') {
    obj.institution = { name: obj.institution, type: 'college' };
  } else if (!obj.institution) {
    obj.institution = { name: 'General Commuter', type: 'college' };
  }
  if (obj.vehicle) {
    obj.vehicle.licensePlate = obj.vehicle.licensePlate || obj.vehicle.plateNumber || '';
    obj.vehicle.plateNumber = obj.vehicle.plateNumber || obj.vehicle.licensePlate || '';
  }
  if (obj.emergencyContact) {
    obj.emergencyContact.relation = obj.emergencyContact.relation || obj.emergencyContact.relationship || '';
    obj.emergencyContact.relationship = obj.emergencyContact.relationship || obj.emergencyContact.relation || '';
  }
  return obj;
};

export const User = mongoose.model('User', userSchema);
