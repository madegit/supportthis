import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  description: String,
  progress: Number,
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema)