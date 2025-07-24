const UserData = require('../models/UserData');

exports.saveUserData = async (req, res) => {
  const { userId, education, stream, interests, skills, courses, internships, videos, jobs } = req.body;
  try {
    const existingData = await UserData.findOne({ userId });
    if (existingData) {
      await UserData.findOneAndUpdate({ userId }, { education, stream, interests, skills, courses, internships, videos, jobs });
      return res.json({ message: 'User data updated successfully' });
    }
    await UserData.create({ userId, education, stream, interests, skills, courses, internships, videos, jobs });
    res.status(201).json({ message: 'User data saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserData = async (req, res) => {
  const { userId } = req.params;
  try {
    const userData = await UserData.findOne({ userId });
    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
