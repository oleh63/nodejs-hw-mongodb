import { contactsCollection } from '../models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({ perPage, page, sortBy, sortOrder }) => {
  const limit = perPage;
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsCount = await contactsCollection.countDocuments();
  const contacts = await contactsCollection
    .find()
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      contacts,
      ...paginationData,
    },
  };
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
  const contact = await contactsCollection.findOneAndDelete({ _id: id });
  return contact;
};
