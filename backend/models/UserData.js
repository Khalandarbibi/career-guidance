const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  education: { type: String },
  stream: { type: String },
  interests: [String],
  skills: [String],
  courses: [Object],
  internships: [Object],
  videos: [Object],
  jobs: [Object],
});

module.exports = mongoose.model('UserData', UserDataSchema);
