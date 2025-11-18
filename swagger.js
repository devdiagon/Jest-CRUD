const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json'; // The generated spec file
const endpointsFiles = ['./src/app.js']; // Your main application file

// Run the generator
swaggerAutogen(outputFile, endpointsFiles);

