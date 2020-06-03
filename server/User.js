const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  contactEmail: String,
  photoUrl: String,
  jobRole: String,
  phoneNumber: String,
});

mongoose.model('user', UserSchema);
