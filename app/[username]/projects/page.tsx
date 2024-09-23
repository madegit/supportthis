// app/[username]/projects/page.tsx
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export default async function UserProjects({ params }: { params: { username: string } }) {
  const { username } = params;

  await connectToDatabase();
  const user = await User.findOne({ username });

  if (!user) {
    notFound();
  }

  return (
    <div>
      <h1>{user.name}'s Projects</h1>
      <p>This is a sample projects page for {user.username}</p>
      {/* Add project list or other content here */}
    </div>
  );
}