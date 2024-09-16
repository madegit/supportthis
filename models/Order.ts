import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: String,
  customerEmail: String,
  customerImage: String,
  amount: Number,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)