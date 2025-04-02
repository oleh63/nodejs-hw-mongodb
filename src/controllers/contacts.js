import createHttpError from 'http-errors';

import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contact.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user.id,
  });

  res.json(contacts);
};

export const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;

  const contact = await getContactById(id, req.user.id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  if (contact.userId.toString() !== req.user.id.toString()) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = {
    ...req.body,
    userId: req.user.id,
  };

  const result = await createContact(contact);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: result,
  });
};

export const updateContactController = async (req, res, next) => {
  const { id } = req.params;
  const contact = req.body;

  const result = await updateContact(id, req.user.id, contact);

  if (!result) {
    return next(createHttpError(404, 'Contact not found'));
  }

  if (!result || result.userId.toString() !== req.user.id.toString()) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { id } = req.params;

  const contact = await deleteContact(id, req.user.id);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  if (!contact.userId || contact.userId.toString() !== req.user.id.toString()) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(204).send();
};
