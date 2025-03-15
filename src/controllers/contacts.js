import { getAllContacts, getContactById } from '../services/contact.js';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  const contact = await getContactById(id);

  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};
