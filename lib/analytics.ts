// lib/analytics.ts
import { connectToDatabase } from './mongodb';
import Analytics from '../models/Analytics';

export async function trackPageView(username: string, pathname: string) {
  try {
    await connectToDatabase();
    await Analytics.findOneAndUpdate(
      { username, pathname },
      { $inc: { visits: 1 }, lastVisited: new Date() },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}