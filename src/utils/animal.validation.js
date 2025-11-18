const validateAnimalPayload = (name, species, age, gender) => {
  
   if (name === undefined || name === null ||
      species === undefined || species === null ||
      age === undefined || age === null ||
      gender === undefined || gender === null) {
    return { valid: false, message: 'Name, species, age and gender are required' };
  }

  if(String(name).trim() === '') {
    return { valid: false, message: 'Name cannot be empty' };
  }

  if(String(species).trim() === '') {
    return { valid: false, message: 'Species cannot be empty' };
  }

  if(age <= 0) {
    return { valid: false, message: 'Age must be a positive number' };
  }

  if(!Number.isInteger(age)){
    return { valid: false, message: 'Age must be a whole numbers' };
  }

  if(gender !== 'Macho' && gender !== 'Hembra') {
    return { valid: false, message: 'Gender can only be Macho or Hembra' };
  }

  return { valid: true, message: '' };

}

module.exports = { validateAnimalPayload };