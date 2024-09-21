import User from '../models/User';

const RESTRICTED_USERNAMES = ['admin', 'root', 'system', 'moderator', 'support'];

export async function generateUsername(firstName: string, lastName: string): Promise<string> {
  let baseUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}`.replace(/[^a-z0-9]/g, '');
  let username = baseUsername;
  let suffix = 1;

  while (await isUsernameTaken(username) || RESTRICTED_USERNAMES.includes(username.toLowerCase())) {
    username = `${baseUsername}${suffix}`;
    suffix++;
  }

  return username;
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const user = await User.findOne({ username: username.toLowerCase() });
  return !!user;
}

export function isUsernameValid(username: string): boolean {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username) && !RESTRICTED_USERNAMES.includes(username.toLowerCase());
}