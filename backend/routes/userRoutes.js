const express = require('express');
const router = express.Router();
const { saveUserData, getUserData } = require('../controllers/userController');

router.post('/save', saveUserData);
router.get('/:userId', getUserData);

module.exports = router;
