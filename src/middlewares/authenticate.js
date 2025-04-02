import createHttpError from 'http-errors';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (typeof authorization !== 'string') {
    return next(createHttpError(401, 'Please provide access token'));
  }

  const [bearer, accessToken] = authorization.split(' ', 2);

  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    return next(createHttpError(401, 'Please provide access token'));
  }

  const session = await Session.findOne({ accessToken });

  if (session === null) {
    return next(createHttpError(401, 'Session not found!'));
  }

  if (session.accesTokenValidUntil < new Date()) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId);

  if (user === null) {
    return next(createHttpError(401, 'User not found!'));
  }

  req.user = { id: user._id, name: user.name };

  next();
};
