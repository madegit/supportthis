import mongoose from 'mongoose'

const CreatorSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  creatorId: String,
})

export default mongoose.models.Creator || mongoose.model('Creator', CreatorSchema)