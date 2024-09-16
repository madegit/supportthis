import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  image: { type: String },
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User