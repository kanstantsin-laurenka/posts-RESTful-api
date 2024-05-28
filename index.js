require('dotenv').config({ path: `./environments/.env.${process.env.NODE_ENV}` });
const path = require('node:path');

const express = require('express');
const { connect } = require('mongoose');

const app = express();

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use((req, res, next) => {
  res.status(404).send('<h1>Page not found</h1>');
});


app.use((error, req, res, next) => {
  console.error(error);
  const { statusCode, message, data } = error;
  
  res.status(statusCode || 500).json({ message, data });
});

const initializeApp = async () => {
  try {
    await connect(process.env.MONGODB_URI);
    app.listen(8080, () => {
      console.log('Server is running on port 8080');
    });
    
    io.on('connection', socket => {
      console.log('Client connected!');
      
      socket.on('disconnect', () => {
        console.log('Client disconnected!');
      })
    });
  } catch (e) {
    console.error(e);
  }
}

(() => initializeApp())();
