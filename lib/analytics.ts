// lib/analytics.ts
import { connectToDatabase } from './mongodb';
import Analytics from '../models/Analytics';

export async function trackPageView(username: string, pathname: string) {
  try {
    await connectToDatabase();

    // Normalize the pathname
    const normalizedPathname = pathname === '/[username]' ? '/[username]' : pathname.replace(`/${username}`, '/[username]');

    // Check if a visit for this pathname has been recorded in the last 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const existingVisit = await Analytics.findOne({
      username,
      pathname: normalizedPathname,
      lastVisited: { $gte: thirtyMinutesAgo }
    });

    if (!existingVisit) {
      // If no recent visit, create a new entry or update an existing one
      await Analytics.findOneAndUpdate(
        { username, pathname: normalizedPathname },
        { $inc: { visits: 1 }, lastVisited: new Date() },
        { upsert: true, new: true }
      );
    } else {
      // If a recent visit exists, just update the lastVisited timestamp
      await Analytics.findOneAndUpdate(
        { _id: existingVisit._id },
        { lastVisited: new Date() }
      );
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}