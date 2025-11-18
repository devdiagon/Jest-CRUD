const validateUserPayload = (name, email) => {
  if (name === undefined || name === null ||
     email === undefined || email === null) {
    return { valid: false, message: 'Name and email are required' };
  }

  if (String(name).trim() === '') {
    return { valid: false, message: 'Name cannot be empty' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email).trim())) {
    return { valid: false, message: 'Email must be a valid email address' };
  }

  return { valid: true, message: '' };
};

module.exports = { validateUserPayload };

