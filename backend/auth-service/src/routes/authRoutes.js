const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getProfile,
  verifyToken
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  register
);

router.post('/login', login);
router.get('/profile', protect, getProfile);
router.get('/verify', protect, verifyToken);

module.exports = router;
