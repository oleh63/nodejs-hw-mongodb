import express, { Router } from 'express';

import {
  getContactByIdController,
  getContactsController,
  createContactController,
  updateContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();
const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:id', ctrlWrapper(getContactByIdController));

router.post('/contacts', jsonParser, ctrlWrapper(createContactController));

router.patch('/contacts/:id', jsonParser, ctrlWrapper(updateContactController));

export default router;
