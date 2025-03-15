import { contactsCollection } from '../models/contact.js';

export const getAllContacts = async () => {
  const contacts = await contactsCollection.find();
  return contacts;
};

export const getContactById = async (id) => {
  const contact = await contactsCollection.findById(id);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await contactsCollection.create(payload);
  return contact;
};

export const updateContact = async (id, payload) => {
  const result = await contactsCollection.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

export const deleteContact = async (id) => {
  const contact = await contactsCollection.findOneAndDelete(id);
  return contact;
};
