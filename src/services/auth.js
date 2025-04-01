import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (user !== null) {
    throw createHttpError.Conflict('Email in use!');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (user === null) {
    throw createHttpError.Unauthorized('Email or password is incorrect!');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch !== true) {
    throw createHttpError.Unauthorized('Email or password is incorrect!');
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accesToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accesTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenvalidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const logoutUser = async (sessionId, refreshToken) => {
  await Session.deleteOne({ _id: sessionId, refreshToken });

  return undefined;
};

export const refreshSession = async (sessionId, refreshToken) => {
  const currentSession = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (currentSession === null) {
    throw createHttpError(401, 'Session not found');
  }

  if (currentSession.refreshTokenvalidUntil < new Date()) {
    throw createHttpError(401, 'Session token expired');
  }

  await Session.deleteOne({
    _id: currentSession.id,
    refreshToken: currentSession.refreshToken,
  });

  return Session.create({
    userId: currentSession.userId,
    accesToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accesTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenvalidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};
