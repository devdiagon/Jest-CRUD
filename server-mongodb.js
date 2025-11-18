const app = require('./app-mongodb');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Documentation available at http://localhost:${PORT}/doc`);
  console.log('Using MongoDB database');
});

