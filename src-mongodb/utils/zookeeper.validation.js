const validateZookeeperPayload = (name, email, specialization, yearsOfExperience) => {
  if (name === undefined || name === null ||
     email === undefined || email === null ||
     specialization === undefined || specialization === null ||
     yearsOfExperience === undefined || yearsOfExperience === null) {
    return { valid: false, message: 'Name, email, specialization and yearsOfExperience are required' };
  }

  if (String(name).trim() === '') {
    return { valid: false, message: 'Name cannot be empty' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email).trim())) {
    return { valid: false, message: 'Email must be a valid email address' };
  }

  if (String(specialization).trim() === '') {
    return { valid: false, message: 'Specialization cannot be empty' };
  }

  if (yearsOfExperience < 0) {
    return { valid: false, message: 'Years of experience must be a non-negative number' };
  }

  if (!Number.isInteger(yearsOfExperience)) {
    return { valid: false, message: 'Years of experience must be a whole number' };
  }

  return { valid: true, message: '' };
};

module.exports = { validateZookeeperPayload };

