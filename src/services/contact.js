import { contactsCollection } from '../models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  perPage,
  page,
  sortBy,
  sortOrder,
  filter,
  userId,
}) => {
  const limit = perPage;
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = contactsCollection.find({
    userId,
  });

  if (filter.contactType) {
    contactQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite !== undefined) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const contactsCount = await contactsCollection.countDocuments({ userId });
  const contacts = await contactQuery
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);
  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      ...paginationData,
    },
  };
};

export const getContactById = async (id, userId) => {
  const contact = await contactsCollection.findOne({ _id: id, userId });
  return contact;
};

export const createContact = async (payload) => {
  const contact = await contactsCollection.create(payload);
  return contact;
};

export const updateContact = async (id, userId, payload) => {
  const result = await contactsCollection.findOneAndUpdate(
    { _id: id, userId },
    payload,
    {
      new: true,
    },
  );

  return result;
};

export const deleteContact = async (id, userId) => {
  const contact = await contactsCollection.findOneAndDelete({
    _id: id,
    userId,
  });
  return contact;
};
