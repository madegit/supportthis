// models/Analytics.ts
import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  username: { type: String, required: true, index: true },
  pathname: { type: String, required: true },
  visits: { type: Number, default: 0 },
  lastVisited: { type: Date, default: Date.now },
});

const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);

export default Analytics;