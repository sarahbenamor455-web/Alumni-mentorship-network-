const express = require('express');
const cors = require('cors');
require('./db'); // initializes the database

const app = express();

app.use(cors({ origin: 'http://localhost:4200' })); // allow the Angular dev server
app.use(express.json());

app.use('/api/users', require('./routes/search.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));