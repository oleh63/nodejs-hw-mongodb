const parseBoolean = (value) => {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return undefined;
};

export const parseFilterParams = (query) => {
  const { contactType, isFavourite } = query;

  return {
    contactType: typeof contactType === 'string' ? contactType : undefined,
    isFavourite: parseBoolean(isFavourite),
  };
};
