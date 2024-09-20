import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
    images: {
      type: [String],
      validate: {
        validator: function(v: string[]) {
          return v.length <= 4;
        },
        message: (props: { path: string }) => `${props.path} exceeds the limit of 4 images`
      }
  },
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

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;