import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    type: String,
    validate: [arrayLimit, '{PATH} exceeds the limit of 4']
  }],
  description: {
    type: String,
    required: true
  },
  goal: {
    type: Number,
    required: true
  },
  currentProgress: String,
  futurePlans: String,
  comments: [{
    name: String,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

function arrayLimit(val: any[]) {
  return val.length <= 4;
}

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);