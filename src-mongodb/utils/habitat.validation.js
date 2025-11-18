const validateHabitatPayload = (name, type, capacity, location) => {
  if (name === undefined || name === null ||
     type === undefined || type === null ||
     capacity === undefined || capacity === null ||
     location === undefined || location === null) {
    return { valid: false, message: 'Name, type, capacity and location are required' };
  }

  if (String(name).trim() === '') {
    return { valid: false, message: 'Name cannot be empty' };
  }

  if (String(type).trim() === '') {
    return { valid: false, message: 'Type cannot be empty' };
  }

  if (String(location).trim() === '') {
    return { valid: false, message: 'Location cannot be empty' };
  }

  if (capacity <= 0) {
    return { valid: false, message: 'Capacity must be a positive number' };
  }

  if (!Number.isInteger(capacity)) {
    return { valid: false, message: 'Capacity must be a whole number' };
  }

  return { valid: true, message: '' };
};

module.exports = { validateHabitatPayload };

