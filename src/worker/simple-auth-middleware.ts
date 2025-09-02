import { Context, Next } from 'hono';

export interface SimpleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
}

export const simpleAuthMiddleware = async (c: Context, next: Next) => {
  const userId = c.req.header('X-User-ID');
  
  if (!userId) {
    return c.json({ error: 'User not authenticated' }, 401);
  }

  // Create a simple user object for demo purposes
  // In a real app, you'd validate the user ID and fetch user data
  const user: SimpleUser = {
    id: userId,
    email: 'demo@mintary.app',
    name: 'Demo User',
    given_name: 'Demo'
  };

  c.set('user', user);
  await next();
};
