import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  creatorId: String,
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)