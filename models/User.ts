import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatarImage: String, 
  coverImage: String,
  bio: String,
  socialLinks: {
    twitter: String,
    instagram: String,
    linkedin: String,
    website: String,
  },
  // ... other fields
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;