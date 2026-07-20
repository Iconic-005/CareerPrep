export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const customUserId = req.headers['x-user-id'];

  let userId = 'default_user';
  let email = 'user@example.com';
  let name = 'User';

  if (customUserId) {
    userId = customUserId;
    if (req.headers['x-user-name']) {
      name = decodeURIComponent(req.headers['x-user-name']);
    }
    if (req.headers['x-user-email']) {
      email = req.headers['x-user-email'];
    }
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      // Decode simple token string or base64 token
      if (token.startsWith('usr_')) {
        userId = token;
      } else {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
        userId = decoded.id || token;
        email = decoded.email || email;
        name = decoded.name || name;
      }
    } catch (err) {
      userId = token || 'default_user';
    }
  }

  req.user = { id: userId, email, name };
  next();
}

export function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    issuedAt: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}
