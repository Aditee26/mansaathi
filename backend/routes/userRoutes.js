const express = require('express');
const { updateProfile, changePassword, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // every route below requires authentication

router.put('/me', updateProfile);
router.put('/me/password', changePassword);
router.delete('/me', deleteAccount);

module.exports = router;
