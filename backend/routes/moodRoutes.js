const express = require('express');
const { body } = require('express-validator');
const {
  getMoods,
  getTodayMood,
  upsertMood,
  deleteMood,
  getMoodInsights,
} = require('../controllers/moodController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getMoods);
router.get('/today', getTodayMood);
router.get('/insights', getMoodInsights);
router.post(
  '/',
  [
    body('mood')
      .isIn(['awful', 'low', 'okay', 'good', 'great'])
      .withMessage('Mood must be one of: awful, low, okay, good, great'),
  ],
  validate,
  upsertMood
);
router.delete('/:id', deleteMood);

module.exports = router;
