require('dotenv').config(); // load environment variables from .env file

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const courseRoutes = require('./routes/course.routes');
const teacherRoutes = require('./routes/teacher.routes');


const app = express();

// middlewares
app.use(express.json()); // reemplaza bodyParser.json()


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// mongo
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);

const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

// routes
app.use(courseRoutes);
app.use(teacherRoutes);

// start the app
app.listen(3001, () => console.log('UTN API service listening on port 3001!'));
