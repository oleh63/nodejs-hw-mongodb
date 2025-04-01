import express, { Router } from 'express';

import {
  getContactByIdController,
  getContactsController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactsSchema,
  updateContactsSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:id', isValidId, ctrlWrapper(getContactByIdController));

router.post(
  '/',
  jsonParser,
  validateBody(createContactsSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:id',
  jsonParser,
  validateBody(updateContactsSchema),
  isValidId,
  ctrlWrapper(updateContactController),
);

router.delete(
  ':id',
  jsonParser,
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default router;
