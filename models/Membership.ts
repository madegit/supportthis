import mongoose from 'mongoose'

const MembershipSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  memberName: String,
  memberEmail: String,
  memberImage: String,
  planName: String,
  planAmount: Number,
  status: String,
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Membership || mongoose.model('Membership', MembershipSchema)