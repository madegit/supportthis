import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  image: String,
  bio: String,
  socialLinks: {
    twitter: String,
    instagram: String,
    linkedin: String,
    website: String,
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);