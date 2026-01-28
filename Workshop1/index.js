require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes.js');

const app = express();

app.use(express.json());
app.use('/api', routes);

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

