import mongoose from 'mongoose'

const SupporterSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Supporter || mongoose.model('Supporter', SupporterSchema)