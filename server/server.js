const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./User');

const app = express();

app.use(bodyParser.json());

const PORT = 3000;

const User = mongoose.model('user');

const mongoURI =
  'mongodb+srv://gwr:ZJcU6EaT6yMAMbzR@chatbotcluster-g5isy.mongodb.net/test?retryWrites=true&w=majority';

// MongoClient constructor
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  // new Server Discover and Monitoring engine
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () =>
  console.log('Connected to MongoDB 🎉'),
);
mongoose.connection.on('error', (err) =>
  console.log('Error, something went wrong!: ', err),
);

app.get('/', (req, res) => {
  res.send('Welcome to node.js');
});

app.post('/send-data', (req, res) => {
  const {
    firstName,
    lastName,
    contactEmail,
    photoUrl,
    jobRole,
    phoneNumber,
  } = req.body;

  const user = new User({
    firstName,
    lastName,
    contactEmail,
    photoUrl,
    jobRole,
    phoneNumber,
  });

  user
    .save()
    .then((data) => {
      console.log('data: ', data);
      res.send('success');
    })
    .catch((err) => {
      console.log('Could not save!: ', err);
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🌎`));
